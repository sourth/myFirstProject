import React from 'react';
import DonationHeader from './childernComponent/donationHeader';
import DonationList from './childernComponent/donationList';
import DonationPickUp from './childernComponent/donationPickUp';
import DonationInfo from './childernComponent/donationInfo';

export default class Donation extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			donationId:0,
			keyWord:''
		};
	}
	render(){
		return (
			<div id="donationPageContent">
				 <div className="checkHeader">
					<DonationHeader money_num={this.state.money_num} searchDonation = {this.keyWord.bind(this)}/>
				</div>
				<div>
				<DonationList callBackDonationId={this.changeDonationId.bind(this)} keyWord = {this.state.keyWord}/>
					<DonationPickUp  />
				<DonationInfo donationId={this.state.donationId} />
				</div>
			</div>
		)
	}
	changeDonationId(id){
		this.setState({
			donationId:id
		})
	}
	keyWord(){
		this.setState({
			keyWord:$(".keyWords").val().trim()
		})
	}
}