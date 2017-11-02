import update from "react-addons-update";
import constants from "./actionConstants";
import { Dimensions } from "react-native";
import RNGooglePlaces from "react-native-google-places";
import request from "../../../util/request";
import calculateFare from "../../../util/fareCalculator";

//------------------------
//Constants
//------------------------
const { GET_CURRENT_LOCATION, 
		GET_INPUT, 
		TOGGLE_SEARCH_RESULT,
		GET_ADDRESS_PREDICTIONS,
		GET_SELECTED_ADDRESS,
		GET_DISTANCE_MATRIX,
		GET_FARE,
		GET_SELECTED_VEHICLE,
		SHOW_ADDITIONAL_MODAL,
		ADD_ADDITIONAL_PRICE,
		REMOVE_ADDITIONAL_PRICE,
		GET_ADDITIONAL_SERVICES,
		REMOVE_ADDITIONAL_SERVICES,
		ADDITIONAL_SERVICE_1,
		ADDITIONAL_SERVICE_2,
		ADDITIONAL_SERVICE_3,
		ADDITIONAL_SERVICE_4,
		ADDITIONAL_SERVICE_5,
		ADDITIONAL_SERVICE_6,
		UPDATE_ADDITIONAL_SERVICE
	} = constants;

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

//------------------------
//Actions
//------------------------
export function getCurrentLocation(){
	return(dispatch) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				dispatch({
					type: GET_CURRENT_LOCATION,
					payload: position
				});
			},
			(error) => console.log(error.message),
			{enableHighAccuracy: false, timeout: 20000, maximumAge:1000}
		);
	}
}

//Get user input
export function getInputData(payload) {
	return{
		type: GET_INPUT,
		payload
	}
}

//Toggle search result modal
export function toggleSearchResultmodal(payload) {
	return{
		type: TOGGLE_SEARCH_RESULT,
		payload
	}
}

//Show additional modal
export function showAdditionalModal(payload) {
	return{
		type: SHOW_ADDITIONAL_MODAL,
		payload
	}
}

//Get addresses from google place
export function getAddressPredictions() {
	return(dispatch, store) => {
		let userInput = store().home.resultTypes.pickUp ? store().home.inputData.pickUp : store().home.inputData.dropOff;
		if (userInput != "") {
			RNGooglePlaces.getAutocompletePredictions(userInput,
				{
					country: "PH"
				}
			)
			.then((results) =>
				dispatch({
					type: GET_ADDRESS_PREDICTIONS,
					payload: results
				})
			)
			.catch((error) => console.log(error.message))
		}
	};
}

//Get selected address
export function getSelectedAddress(payload) {
	const dummyNumbers = {
		baseFare: 0.4,
		timeRate: 0.14,
		distanceRate: 0.97,
		surge: 1
	}

	return (dispatch, store) => {
		RNGooglePlaces.lookUpPlaceByID(payload)
		.then((results) => {
			dispatch({
				type: GET_SELECTED_ADDRESS,
				payload: results
			})
		})
		.then(() => {
			//Get the distance and time
			if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){
				request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
				.query({
					origins:store().home.selectedAddress.selectedPickUp.latitude + "," + store().home.selectedAddress.selectedPickUp.longitude,
					destinations:store().home.selectedAddress.selectedDropOff.latitude + "," + store().home.selectedAddress.selectedDropOff.longitude,
					mode: "driving",
					key: "AIzaSyBNDEF41tmSDitm8r73vTGbUviVpKC1XiM"
				})
				.finish((error, res)=>{
					dispatch({
						type:GET_DISTANCE_MATRIX,
						payload:res.body
					});
				})
				setTimeout(function() {
					if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){
						const fare = calculateFare(
							dummyNumbers.baseFare,
							dummyNumbers.timeRate,
							store().home.distanceMatrix.rows[0].elements[0].duration.value,
							dummyNumbers.distanceRate,
							store().home.distanceMatrix.rows[0].elements[0].distance.value,
							dummyNumbers.surge,
							store().home.selectedVehicle
						);
						dispatch({
							type: GET_FARE,
							payload: fare
						})
					}
				}, 1000)
			}
		})
		.catch((error) => console.log(error.message));
	}
}

export function getSelectedVehicle(payload) {
	const dummyNumbers = {
		baseFare: 0.4,
		timeRate: 0.14,
		distanceRate: 0.97,
		surge: 1
	}

	return(dispatch, store) => {
		dispatch({
			type: GET_SELECTED_VEHICLE,
			payload
		})

		if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.selectedDropOff){
			const fare = calculateFare(
				dummyNumbers.baseFare,
				dummyNumbers.timeRate,
				store().home.distanceMatrix.rows[0].elements[0].duration.value,
				dummyNumbers.distanceRate,
				store().home.distanceMatrix.rows[0].elements[0].distance.value,
				dummyNumbers.surge,
				store().home.selectedVehicle
			);
			dispatch({
				type: GET_FARE,
				payload: fare
			})
		}
	}
}

//Add additional services
export function addAdditionalServices(payload) {
	return(dispatch, store) => {
		const arrAdditionalServices = store().home.additionalServices;

		arrAdditionalServices.push(payload);

		dispatch({
			type: GET_ADDITIONAL_SERVICES,
			payload: arrAdditionalServices
		})
	}
}

//Remove additional services
export function removeAdditionalServices(payload) {
	return(dispatch, store) => {
		const arrAdditionalServices = store().home.additionalServices;
		
		for(var i = 0; i <= arrAdditionalServices.length-1; i++){
			if (arrAdditionalServices[i].service === payload.service) {
				arrAdditionalServices.splice(i, 1);
			}
		}

		dispatch({
			type: GET_ADDITIONAL_SERVICES,
			payload: arrAdditionalServices
		})
	}
}

//Add additional price 
export function addAdditionalPrice(payload) {
	return(dispatch, store) => {
		dispatch({
			type: ADD_ADDITIONAL_PRICE,
			payload: store().home.additionalPrice + payload
		})

		// if (store().home.fare != undefined) {
		// 	dispatch({
		// 		type: GET_FARE,
		// 		payload: store().home.fare + payload
		// 	})
		// }
	}
}

//Remove additional price
export function removeAdditionalPrice(payload) {
	return(dispatch, store) => {
		dispatch({
			type: ADD_ADDITIONAL_PRICE,
			payload: store().home.additionalPrice - payload
		})

		// if (store().home.fare != undefined) {
		// 	dispatch({
		// 		type: GET_FARE,
		// 		payload: store().home.fare - payload
		// 	})
		// }
	}
}

//Add additional service 1: Goods longer than 6ft (P50)
export function additionalService1(payload) {
	return{
		type: ADDITIONAL_SERVICE_1,
		payload
	}
}

//Add additional service 2: Borrow cart (P60)
export function additionalService2(payload) {
	return{
		type: ADDITIONAL_SERVICE_2,
		payload
	}
}

//Add additional service 3: Mover (P100)
export function additionalService3(payload) {
	return{
		type: ADDITIONAL_SERVICE_3,
		payload
	}
}

//Add additional service 4: Pets (P50)
export function additionalService4(payload) {
	return{
		type: ADDITIONAL_SERVICE_4,
		payload
	}
}

//Add additional service 5: New Car (P100)
export function additionalService5(payload) {
	return{
		type: ADDITIONAL_SERVICE_5,
		payload
	}
}

//Add additional service 6: Dunpler/Construction waste (P65)
export function additionalService6(payload) {
	return{
		type: ADDITIONAL_SERVICE_6,
		payload
	}
}

export function updateAdditionalService(payload) {
	const { service, value } = payload;

	if (service == 1) {
		return(dispatch, store) => {
			dispatch({
				type: ADDITIONAL_SERVICE_1,
				payload: value
			})
		}
	}

	if (service == 2) {
		return(dispatch, store) => {
			dispatch({
				type: ADDITIONAL_SERVICE_2,
				payload: value
			})
		}
	}

	if (service == 3) {
		return(dispatch, store) => {
			dispatch({
				type: ADDITIONAL_SERVICE_3,
				payload: value
			})
		}
	}

	if (service == 4) {
		return(dispatch, store) => {
			dispatch({
				type: ADDITIONAL_SERVICE_4,
				payload: value
			})
		}
	}

	if (service == 5) {
		return(dispatch, store) => {
			dispatch({
				type: ADDITIONAL_SERVICE_5,
				payload: value
			})
		}
	}

	if (service == 6) {
		return(dispatch, store) => {
			dispatch({
				type: ADDITIONAL_SERVICE_6,
				payload: value
			})
		}
	}

}

//------------------------
//Action Handlers
//------------------------
function handleGetCurrentLocation(state, action){
	return update(state, {
		region:{
			latitude:{
				$set: action.payload.coords.latitude
			},
			longitude:{
				$set: action.payload.coords.longitude
			},
			latitudeDelta:{
				$set: LATITUDE_DELTA
			},
			longitudeDelta:{
				$set: LONGITUDE_DELTA
			}
		}
	})
}

function handleGetInputData(state, action){
	const { key, value } = action.payload;
	return update(state, {
		inputData: {
			[key]: {
				$set:value
			}
		}
	});
}

function handleToggleSearchResult(state, action){
	if(action.payload === "pickUp") {
		return update(state, {
			resultTypes: {
				pickUp: {
					$set: true,
				},
				dropOff: {
					$set: false
				}
			},
			predictions: {
				$set: {}
			},
			selectedAddress: {
				selectedPickUp: {
					$set: {}
				}
			},
			fare: {
				$set: null
			}
		})
	}

	if(action.payload === "dropOff") {
		return update(state, {
			resultTypes: {
				pickUp: {
					$set: false,
				},
				dropOff: {
					$set: true
				}
			},
			predictions: {
				$set: {}
			},
			selectedAddress: {
				selectedDropOff: {
					$set: {}
				}
			},
			fare: {
				$set: null
			}
		})
	}
}

function handleShowAdditionalModal(state, action) {
	return update(state, {
		isAdditionalModalVisible: {
			$set: action.payload
		}
	})
}

function handleGetAddressPredictions(state, action) {
	return update(state, {
		predictions: {
			$set: action.payload
		}
	})
}

function handleGetSelectedAddress(state, action) {
	let selectedTitle = state.resultTypes.pickUp ? "selectedPickUp" : "selectedDropOff";
	return update(state, {
		selectedAddress: {
			[selectedTitle]:{
				$set: action.payload
			}
		},
		resultTypes: {
			pickUp: {
				$set: false
			},
			dropOff: {
				$set: false
			}
		}
	})
}

function handleGetDistanceMatrix(state, action) {
	return update(state, {
		distanceMatrix: {
			$set: action.payload
		}
	})
}

function handleGetFare(state, action) {
	return update(state, {
		fare: {
			$set: action.payload
		}
	})
}

function handleGetSelectedVehicle(state, action) {
	return update(state, {
		selectedVehicle: {
			$set: action.payload
		}
	})
}

function handleGetAdditionalServices(state, action) {
	return update(state, {
		additionalServices: {
			$set: action.payload
		}
	})
}

function handleAddAdditionalPrice(state, action) {
	return update(state, {
		additionalPrice: {
			$set: action.payload
		}
	})
}

function handleRemoveAdditionalPrice(state, action) {
	return update(state, {
		additionalPrice: {
			$set: action.payload
		}
	})
}

function handleAdditionalService1(state, action) {
	return update(state, {
		additionalService1: {
			$set: action.payload
		}
	})
}

function handleAdditionalService1(state, action) {
	return update(state, {
		additionalService1: {
			$set: action.payload
		}
	})
}

function handleAdditionalService2(state, action) {
	return update(state, {
		additionalService2: {
			$set: action.payload
		}
	})
}

function handleAdditionalService3(state, action) {
	return update(state, {
		additionalService3: {
			$set: action.payload
		}
	})
}

function handleAdditionalService4(state, action) {
	return update(state, {
		additionalService4: {
			$set: action.payload
		}
	})
}

function handleAdditionalService5(state, action) {
	return update(state, {
		additionalService5: {
			$set: action.payload
		}
	})
}

function handleAdditionalService6(state, action) {
	return update(state, {
		additionalService6: {
			$set: action.payload
		}
	})
}

function handleAdditionalService(state, action) {
	if (action.payload == 1) {
		return update(state, {
			additionalService1: {
				$set: action.payload
			}
		})
	}

	if (action.payload == 2) {
		return update(state, {
			additionalService2: {
				$set: action.payload
			}
		})
	}

	if (action.payload == 3) {
		return update(state, {
			additionalService3: {
				$set: action.payload
			}
		})
	}

	if (action.payload == 4) {
		return update(state, {
			additionalService4: {
				$set: action.payload
			}
		})
	}

	if (action.payload == 5) {
		return update(state, {
			additionalService5: {
				$set: action.payload
			}
		})
	}

	if (action.payload == 6) {
		return update(state, {
			additionalService6: {
				$set: action.payload
			}
		})
	}
}

const ACTION_HANDLERS = {
	GET_CURRENT_LOCATION: handleGetCurrentLocation,
	GET_INPUT: handleGetInputData,
	TOGGLE_SEARCH_RESULT: handleToggleSearchResult,
	GET_ADDRESS_PREDICTIONS: handleGetAddressPredictions,
	GET_SELECTED_ADDRESS: handleGetSelectedAddress,
	GET_DISTANCE_MATRIX: handleGetDistanceMatrix,
	GET_FARE: handleGetFare,
	GET_SELECTED_VEHICLE: handleGetSelectedVehicle,
	SHOW_ADDITIONAL_MODAL: handleShowAdditionalModal,
	GET_ADDITIONAL_SERVICES: handleGetAdditionalServices,
	ADD_ADDITIONAL_PRICE: handleAddAdditionalPrice,
	REMOVE_ADDITIONAL_PRICE: handleRemoveAdditionalPrice,
	ADDITIONAL_SERVICE_1: handleAdditionalService1,
	ADDITIONAL_SERVICE_2: handleAdditionalService2,
	ADDITIONAL_SERVICE_3: handleAdditionalService3,
	ADDITIONAL_SERVICE_4: handleAdditionalService4,
	ADDITIONAL_SERVICE_5: handleAdditionalService5,
	ADDITIONAL_SERVICE_6: handleAdditionalService6,
	UPDATE_ADDITIONAL_SERVICE: handleAdditionalService
}

const initialState = {
	region: {},
	inputData: {},
	resultTypes: {},
	selectedAddress: {},
	selectedVehicle: "motorcycle",
	additionalServices: [],
	additionalPrice: 0,
	additionalService1: false,
	additionalService2: false,
	additionalService3: false,
	additionalService4: false,
	additionalService5: false,
	additionalService6: false
};

export function HomeReducer (state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}