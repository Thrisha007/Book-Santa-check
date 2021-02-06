import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import db from '../config'
import { ListItem, Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader'
import { FlatList } from 'react-native-gesture-handler';

export default class MyDonationScreen extends Component{

    static navigationOptions = {header: null}

    constructor(){
        super()
        this.state = {
            userId: firebase.auth().currentUser.email,
            allDonations: [],
            donorName: ""
        }
        this.requestRef = null
    }

getAllDonations = ()=>{
    this.requestRef = db.collection('all_donations').where("doner_id",'==',this.state.userId)
            .onSnapshot((snapshot)=>{
                var allDonations = []
                snapshot.docs.map((doc)=>{
                    var donation = doc.data()
                    donation["doc_id"] = doc.id
                    allDonations.push(donation)
                })
                this.setState({
                    allDonations: allDonations
                })
            })
}
keyExractor = (item, index)=> index.toString()

renderItem = ({item, i}) =>{
    <ListItem
        key = {i}
        title = {item, book_name}
        subtitle = {"Requested by:"+item.requested_by+"\nStatus: "+item.request_status}
        leftElement = {<Icon
                            name = "Book" type = "font-awesome" color = "blue"/>}
        titleStyle = {{color: 'black', fontWeight: 'bold'}}
        rightElement = {
            <TouchableOpacity style = {styles.button}
                onPress = {()=>{
                    this.sendBook(item)
                }}>
                <Text style = {{color: "green"}}>{
                    item.request_status === "Book sent"?"Book sent":"Send book"
                }</Text>
            </TouchableOpacity>
        }
        bottomDivider
        />
}

sendBook = (bookDetails)=>{
    if(bookDetails.request_status === "Book Sent"){
            var requestStatus = "Doner Interested"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
            "request_status": "Doner Interested"
        })
        this.sendNotification(bookDetails,requestStatus)
    }
    else{
        var requestStatus = "Book Sent"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
            "request_status": "Book Sent"
        })
        this.sendNotification(bookDetails,requestStatus)
    }
}

sendNotification = (bookDetails, requestStatus)=>{
    var requestId = bookDetails.request_id
    var donerId = bookDetails.doner_id
    db.collection("all_notifications").where("request_id","==",requestId)
    .where("doner_id","==",donerId).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            var message = ""
            if(requestStatus === "Book Sent"){
                message = this.state.donerName+" has sent you a book"
            }
            else{
                message = this.state.donerName+" has shown interest in donating the book"
            }
            db.collection("all_notifications").doc(doc.id).update({
                message: message,
                notification_status: "unread",
                date: firebase.firestore.FieldValue.serverTimestamp()
            })
        })
    })
}

getDonorDetails = (donorId)=>{
    db.collection("users").where("email_id","==", donorId).get() 
    .then((snapshot)=>{ snapshot.forEach((doc) => 
        { this.setState({ 
            "donorName" : doc.data().first_name + " " + doc.data().last_name }) 
        });
     })
}

componentDidMount = ()=>{
    this.getDonorDetails(this.state.donorId)
    this.getAllDonations()
}

componentWillUnmount = ()=>{
    this.requestRef()
}

    render(){
        return(
            <View style = {{flex: 1}}>
                <MyHeader navigation = {this.props.navigation} title = "My Donations"/>
                <View style = {{flex: 1}}>
                    {
                        this.state.allDonations.length === 0
                        ?(
                            <View style = {styles.subtitle}>
                                <Text style = {{fontSize: 20}}>List of all book donations</Text>
                            </View>
                        )
                        :(
                            <FlatList 
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.allDonations}
                            renderItem = {this.renderItem}/>
                        )
                    }
                </View>
            </View>
        )
    }
}