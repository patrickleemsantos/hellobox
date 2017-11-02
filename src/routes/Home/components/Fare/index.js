import React from "react";
import {Text} from "react-native";
import { View, Button, Col, Row, Grid} from "native-base";

import styles from "./FareStyles.js";

export const Fare = ({fare, additionalPrice})=>{
	return (
		<View style={styles.fareContainer}>
			<Grid>
				<Col style={styles.colFare}>
					<Text style={styles.fareText}> FARE: ₱</Text><Text style={styles.amountText}>{fare + additionalPrice}</Text>
				</Col>
				{/* <Col style={styles.colBreakdown}>
					<Button style={styles.btnBreakdown} transparent>
						<Text style={styles.showBreakdownText}>Show Breakdown</Text>
					</Button>
				</Col> */}
			</Grid>
		</View>

	);
}

export default  Fare;