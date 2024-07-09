import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import DropdownMenu from 'react-native-dropdown-menu';
import mime from "mime";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import React from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Image,
} from "react-native";
import { Camera } from "expo-camera";


const axios = require('axios');
var finalimg = ""


export default function App() {

    
    const [startCamera, setStartCamera] = React.useState(false);
    // let camera: Camera
    // const camera = useRef(null)
    const [camera, setCamera] = useState(null)
    const __startCamera = async () => {
        const { status } = await Camera.requestPermissionsAsync()
        if (status == 'granted') {
            // do something
            console.log("We are back")
            setStartCamera(true)
        } else {
            Alert.alert("Access denied")

        }
    }
    // const [finalImg,setFinalImg]=useState()
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const __takePicture = async () => {
        if (!camera) return
        console.log("HI")
        const photo = await camera.takePictureAsync()
        console.log(photo)
        setPreviewVisible(true)
        setCapturedImage(photo)
    }
    const __turnoffcam = async () => {
        setStartCamera(false)
        setPreviewVisible(false)
        setCapturedImage(null)
        finalimg = ""
    }

    const updateImg = async (img) => {
        console.log("Hello\n")
        console.log(img.uri)
        // finalimg = await img.uri
        // const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('finalimguri', img.uri)
        } catch (e) {
            console.log(e)
        }
        console.log("In uppdateimg,finalimg=",finalimg)
        // setFinalImg(img.uri)
    }
    const [result,setResult]=useState("")

    const CameraPreview = (photo) => {
        console.log('sdsfds', photo)
        console.log(photo.photo.uri)
        return (
            <View
                style={{
                    // backgroundColor: 'transparent',
                    flex: 1,
                    // alignItems:"center",
                    // alignContent:"center",
                    width: '100%',
                    height: '100%'
                }}
            >
                <ImageBackground
                    source={{ uri: photo.photo.uri }}
                    style={{
                        flex: 1
                    }}
                />
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={__turnoffcam}>
                        <Text>Close Window</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    

    const data = [["Hide and Seek","Colgate Herbal", "Dove Shampoo"]]
    const data1 = [["Parle", "Colgate-Palmolive","Unilever"]]
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    // const __savePhoto=()={

    // }
    const [sel, setSel] = useState("")
    const [sel1, setSel1] = useState("")
    const submitting = async() => {
        // blob=dataURItoBlob(finalimg)
        const newImageUri =  "file:///" + finalimg.split("file:/").join("");
        console.log("Wasusp man initially",finalimg)
        

    try {
    const value = await AsyncStorage.getItem('finalimguri')
    if(value !== null) {
        // value previously stored
        const map1=new Map()
        map1.set("Hide and Seek",1)
        // map1.set("Dove Soap",2)
        map1.set("Dove Shampoo",3)
        console.log(map1.get("Reddit"))
        map1.set("Colgate Herbal",4)
        const map2=new Map()
        map2.set("Parle",1)
        // map2.set("Hindustan Unilever",2)
        map2.set("Unilever",3)
        map2.set("Colgate-Palmolive",4)
        var formdata=new FormData()
        formdata.append("companyID",map2.get(sel1))
        formdata.append("productID",map1.get(sel))
        formdata.append("image",{
            uri:value,
            type: mime.getType(value),
            name: value.split("/").pop()
        })
        console.log("Wasusp",formdata)
        axios.post('http://192.168.0.100:8000/api/imgupload/',formdata)
            .then(function (response) {
                console.log(response.data.percentage);
                setResult(response.data.percentage);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    } catch(e) {
      // error reading value
    }


    }
    return (
        <View style={styles.container}>
            {startCamera ?
                (
                    (previewVisible && capturedImage) ? (
                        <CameraPreview photo={capturedImage} update={updateImg(capturedImage)} retakePicture={__retakePicture} />
                        // <View>
                        //     <Text>Hi</Text>
                        //     </View>
                    ) :
                        (
                            <Camera style={{ flex: 1, width: "100%" }}
                                ref={(ref) => setCamera(ref)}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%',
                                        padding: 20,
                                        justifyContent: 'flex-start'
                                    }}>
                                    <TouchableOpacity
                                        onPress={__turnoffcam}>
                                        <Text>Close Camera</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%',
                                        padding: 20,
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={__takePicture}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                bottom: 0,
                                                borderRadius: 50,
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                    </View>
                                </View>
                            </Camera>
                        )) : (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{ height: 160, width: 300 }}>
                            <DropdownMenu
                                style={{ flex: 1 }}
                                bgColor={'cyan'}
                                tintColor={'#666666'}
                                activityTintColor={'green'}
                                // arrowImg={}      
                                // checkImage={}   
                                // optionTextStyle={{color: '#333333'}}
                                // titleStyle={{color: '#333333'}} 
                                // maxHeight={300} 
                                handler={(selection, row) => {
                                    console.log(sel1)
                                    setSel1(data1[selection][row])
                                    console.log(sel1)
                                }}
                                data={data1}
                            >
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text>
                                        Company Chosen:{sel1}
                                    </Text>
                                </View>
                            </DropdownMenu>
                        </View>
                        <View style={{ height: 160, width: 300 }}>
                            <DropdownMenu
                                style={{ flex: 1 }}
                                bgColor={'cyan'}
                                tintColor={'#666666'}
                                activityTintColor={'green'}
                                // arrowImg={}      
                                // checkImage={}   
                                optionTextStyle={{ color: '#333333' }}
                                titleStyle={{ color: '#333333' }}
                                // maxHeight={300} 
                                handler={(selection, row) => setSel(data[selection][row])}
                                data={data}
                            >
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text>
                                        Product Chosen:{sel}
                                    </Text>
                                </View>
                            </DropdownMenu>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={__startCamera}
                                style={{
                                    width: 130,
                                    borderRadius: 4,
                                    backgroundColor: '#14274e',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 40
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}
                                >
                                    Take picture
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Button
                                onPress={submitting}
                                title="Submit"
                                color="#841584"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
                        <View style={{alignContent:"center",alignItems:"center"}}>
                            {
                                result==""?
                                (
                                    <Text>Take an image and submit to get information ASAP!</Text>
                                ):
                                (
                                    // <Text>Bye</Text>
                                    result>20?
                                        (
                                        <Text>
                                        Your product is a Genuine Product : ({result}%)
                                        </Text>):
                                        (
                                        <Text>
                                        Your product is a Fake Product : ({result}%)
                                        </Text>)
                                    
                                )
                            }
                        </View>
                    </View>
                )}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})
