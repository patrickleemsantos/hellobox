import { connect } from "react-redux";
import AdditionalServices from "../components/AdditionalServices";
import {
    addAdditionalServices,
    removeAdditionalServices,
    addAdditionalPrice,
    removeAdditionalPrice,
    additionalService1,
    additionalService2,
    additionalService3,
    additionalService4,
    additionalService5,
    additionalService6,
    updateAdditionalService,
    setPickUpDateTime,
    setBookingNote
} from "../modules/additionalServices";

const mapStateToProps = (state) => ({   
    inputData: state.home.inputData || {},
    resultTypes: state.home.resultTypes || {},
    predictions: state.home.predictions || [],
    selectedAddress: state.home.selectedAddress || {},
    fare: state.home.fare || 0,
    booking: state.home.booking || {},
    selectedVehicle: state.home.selectedVehicle || {},
    nearByDrivers: state.home.nearByDrivers || [],
    additionalServices: state.additionalServices.additionalServices || [],
    additionalPrice: state.additionalServices.additionalPrice || 0,
    additionalService1: state.additionalServices.additionalService1 || false,
    additionalService2: state.additionalServices.additionalService2 || false,
    additionalService3: state.additionalServices.additionalService3 || false,
    additionalService4: state.additionalServices.additionalService4 || false,
    additionalService5: state.additionalServices.additionalService5 || false,
    additionalService6: state.additionalServices.additionalService6 || false,
    pickUpDateTime: state.additionalServices.pickUpDateTime || "2017-01-01 00:00",
    bookingNote: state.additionalServices.bookingNote || "",
});

const mapActionCreators = { 
    addAdditionalServices,
    removeAdditionalServices,
    addAdditionalPrice,
    removeAdditionalPrice,
    updateAdditionalService,
    setPickUpDateTime,
    setBookingNote
};

export default connect(mapStateToProps, mapActionCreators)(AdditionalServices);