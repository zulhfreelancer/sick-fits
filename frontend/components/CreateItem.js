import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(
			title: $title
			description: $description
			price: $price
			image: $image
			largeImage: $largeImage
		) {
			id
		}
	}
`;

class CreateItem extends Component {
	state = {
		title: "",
		description: "",
		image: "",
		largeImage: "",
		price: 0
	};

	handleChange = e => {
		const { name, type, value } = e.target;
		const val = type === "number" ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	uploadFile = async e => {
		console.log("Uploading file...");
		const files = e.target.files;
		const data = new FormData();
		data.append("file", files[0]);
		data.append("upload_preset", "sickfits");

		const res = await fetch(
			"https://api.cloudinary.com/v1_1/zulhfreelancer/image/upload",
			{
				method: "POST",
				body: data
			}
		);
		const file = await res.json();
		console.log(file);
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url
		});
	};

	render() {
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
				{(createItem, { loading, error }) => (
					<Form
						autoComplete='off'
						onSubmit={async e => {
							// stop form from submitting
							e.preventDefault();
							// call the mutation
							const res = await createItem();
							// change them to the single item page
							Router.push({
								pathname: "/item",
								query: { id: res.data.createItem.id }
							});
						}}>
						<Error error={error} />
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor='title'>Image</label>
							<input
								type='file'
								id='file'
								name='file'
								placeholder='Upload an image'
								required
								onChange={this.uploadFile}
							/>
							{this.state.image && (
								<img src={this.state.image} alt='Upload preview' />
							)}

							<label htmlFor='title'>Title</label>
							<input
								type='text'
								id='title'
								name='title'
								placeholder='Title'
								required
								value={this.state.title}
								onChange={this.handleChange}
							/>

							<label htmlFor='title'>Price</label>
							<input
								type='number'
								id='price'
								name='price'
								placeholder='Price'
								required
								value={this.state.price}
								onChange={this.handleChange}
							/>

							<label htmlFor='title'>Description</label>
							<textarea
								type='text'
								id='description'
								name='description'
								placeholder='Description'
								required
								value={this.state.description}
								onChange={this.handleChange}
							/>

							<button type='submit'>Create</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
