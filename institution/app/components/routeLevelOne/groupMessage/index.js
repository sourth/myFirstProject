import React from 'react';
import './index.less';
import {city} from '../../../../lib/city'
import {uploadImage,uploadImageLogo,uploadImageBackground,uploadImageGroupPicture,uploadGroupFiles} from '../../../../lib/upload';
import {sendAjax,isVal} from '../../../../lib/commonEvent';
import GroupMessageEditor from './childrenComponent/groupMessageEditor'
import GroupMessageShow from './childrenComponent/groupMessageShow'


export default class Account extends React.Component{
	constructor(){
		super();
		this.state = {
			star_level:0,
			groupPageFiles:[
				{
					name:"",
					link:"javascript:;"
				}
			]
		}
	}
	render(){
		return (
			<div>
				<GroupMessageShow />
				<GroupMessageEditor />
			</div>
		)
	}
	componentDidMount(){
		let self = this;
	}
}
