import React from "react";
import { View, Text } from "react-native";
import { Container } from "native-base";
import MapContainer from "./MapContainer";
import HeaderComponent from "../../../components/HeaderComponent";
import SelectVehicle from "./SelectVehicle";
import Fare from "./Fare";
import AdditionalModal from "./AdditionalModal";

const justBoxLogo = require("../../../assets/images/logo.png");

class Home extends React.Component {

    componentDidMount() {
        this.props.getCurrentLocation();
    }

    render() {
        const region = {
            latitude: 14.574036,
            longitude: 121.002582,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }

        return (
            <Container>
                <View style={{flex:1}}>
                    <HeaderComponent 
                            logo={justBoxLogo}
                            showAdditionalModal={this.props.showAdditionalModal}
                        />
                    {this.props.region.latitude &&
                    <MapContainer 
                        region={this.props.region} 
                        getInputData={this.props.getInputData} 
                        toggleSearchResultmodal={this.props.toggleSearchResultmodal}
                        getAddressPredictions={this.props.getAddressPredictions}
                        resultTypes={this.props.resultTypes}
                        predictions={this.props.predictions}
                        getSelectedAddress={this.props.getSelectedAddress}
                        selectedAddress={this.props.selectedAddress}
                    />
                    }
                    { this.props.fare &&
                        <Fare 
                            fare={this.props.fare}
                            additionalPrice={this.props.additionalPrice}
                        />
                    }
                    <SelectVehicle 
                        getSelectedVehicle={this.props.getSelectedVehicle}
                        selectedVehicle={this.props.selectedVehicle} 
                    />
                    <AdditionalModal 
                        fare={this.props.fare}
                        additionalPrice={this.props.additionalPrice}
                        isAdditionalModalVisible={this.props.isAdditionalModalVisible}
                        showAdditionalModal={this.props.showAdditionalModal}
                        addAdditionalServices={this.props.addAdditionalServices}
                        removeAdditionalServices={this.props.removeAdditionalServices}
                        addAdditionalPrice={this.props.addAdditionalPrice}
                        removeAdditionalPrice={this.props.removeAdditionalPrice}
                        additionalService1={this.props.additionalService1}
                        additionalService2={this.props.additionalService2}
                        additionalService3={this.props.additionalService3}
                        additionalService4={this.props.additionalService4}
                        additionalService5={this.props.additionalService5}
                        additionalService6={this.props.additionalService6}
                        updateAdditionalService={this.props.updateAdditionalService}
                    />
                </View>
            </Container>
        );
    }
}

export default Home;