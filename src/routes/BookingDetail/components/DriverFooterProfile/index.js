import React from "react";
import {Text, Image} from "react-native";
import { View, Button } from "native-base";
import StarRating from "react-native-star-rating";
import Icon from "react-native-vector-icons/FontAwesome";
import Communications from 'react-native-communications';
import styles from "./DriverFooterProfileStyles.js";

export const DriverFooterProfile = ({ driverInfo, getDriverLocation})=>{
	const { profile_picture, rating } = driverInfo || "";
	return (
		<View style={styles.footerContainer}>
			<View style={styles.imageContainer}>
				<Image resizemode="contain" style={styles.driverPic} source={{uri:profile_picture}} />
			</View>
			<View style={styles.ratingContainer}>
				<StarRating
					starSize={20}
					disabled={true}
					maxStars={5}
					rating={parseInt(driverInfo.rating)}
					starColor="#FF5E3A"
				/>
			</View>
			<View style={styles.iconContainer}>
				{/* <Icon name="phone" size={30} style={styles.icon}/> */}
			</View>
			<View style={styles.iconContainer}>
				{/* <Icon name="comment-o" size={30} style={styles.icon}/> */}
				<Button transparent onPress={() => Communications.phonecall(driverInfo.mobile_number, true)} >
					<Icon name="phone" size={30} style={styles.icon} />
				</Button>
			</View>
		</View>

	);
}

export default DriverFooterProfile;