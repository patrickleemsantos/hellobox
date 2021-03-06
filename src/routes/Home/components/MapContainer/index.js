import React from "react";
import { View, Text } from "native-base";
import MapView from "react-native-maps";
import SearchBox from "../SearchBox";
import SearchResults from "../SearchResults";
// import Polyline from '@mapbox/polyline';

import styles from "./MapContainerStyles.js"

export const MapContainer = ({region, 
                                getInputData, 
                                toggleSearchResultmodal, 
                                getAddressPredictions, 
                                resultTypes, 
                                predictions, 
                                getSelectedAddress, 
                                selectedAddress,
                                carMarker,
                                nearByDrivers,
                                updateSearchAddressLoadingStatus,
                                isSearchAddressLoading,
                                closeResultType,
                                initialRegion,
                                directions,
                                showExtraDropOff,
                                hideExtraDropOff,
                                showExtraDropOff1,
                                showExtraDropOff2,
                                showExtraDropOff3,
                                showExtraDropOff4,
                                fare,
                                reCalculateFare
                            }) => {

    const { selectedPickUp, selectedDropOff } = selectedAddress || {};
    return(
        <View style={styles.container}>
            <MapView
                provider={MapView.PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
            {/* { region &&
                <MapView.Marker
                    coordinate={{latitude:region.latitude, longitude:region.longitude}}
                    pinColor="red"

                />	
            } */}
            { selectedPickUp &&
                <MapView.Marker
                    coordinate={{latitude:selectedPickUp.latitude, longitude:selectedPickUp.longitude}}
                    pinColor="green"

                />	
            }
            { selectedDropOff &&
                <MapView.Marker
                    coordinate={{latitude:selectedDropOff.latitude, longitude:selectedDropOff.longitude}}
                    pinColor="blue"

                />	
            }
            {/* { (selectedPickUp && selectedDropOff) &&
                <MapView.Polyline
                    coordinates={directions}
                    strokeColor="#E90000"
                    strokeOpacity={0.8}
                    strokeWidth={5}
                />	
            } */}

            { nearByDrivers.name != "MongoError" && 
                // nearByDrivers.map((marker, index)=>
                //     <MapView.Marker
                //         key={index}
                //         coordinate={{latitude:marker.coordinate.coordinates[1], longitude:marker.coordinate.coordinates[0] }}
                //         image={carMarker}
                //     />	
                // )
                nearByDrivers.map(marker => {
                    return (
                        <MapView.Marker
                            key={marker._id}
                            coordinate={{latitude:marker.coordinate.coordinates[1], longitude:marker.coordinate.coordinates[0]}}
                            image={carMarker}
                        />	
                    )
                })
            }
                {/* <MapView.Marker
                    coordinate={region}
                    pinColor="green"
                /> */}
            </MapView>   
            <SearchBox getInputData={getInputData} 
                        toggleSearchResultmodal={toggleSearchResultmodal} 
                        getAddressPredictions={getAddressPredictions}
                        getSelectedAddress={getSelectedAddress}
                        selectedAddress={selectedAddress}
                        showExtraDropOff={showExtraDropOff}
                        hideExtraDropOff={hideExtraDropOff}
                        showExtraDropOff1={showExtraDropOff1}
                        showExtraDropOff2={showExtraDropOff2}
                        showExtraDropOff3={showExtraDropOff3}
                        showExtraDropOff4={showExtraDropOff4}
                        fare={fare}
                        reCalculateFare={reCalculateFare}
            />
            { (resultTypes.pickUp || resultTypes.dropOff || resultTypes.extraDropOff1 || resultTypes.extraDropOff2 || resultTypes.extraDropOff3 || resultTypes.extraDropOff4) && 
            <SearchResults 
                    updateSearchAddressLoadingStatus={updateSearchAddressLoadingStatus}
                    isSearchAddressLoading={isSearchAddressLoading}
                    predictions={predictions}
                    getSelectedAddress={getSelectedAddress}
                    closeResultType={closeResultType}
                />
            }
        </View>
    )
}

export default MapContainer;