import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader'

export default class MyRecievedBooksScreen extends Component{

    constructor(){
        super()
        this.state = {
            userId: firebase.auth().currentUser.email,
            recievedBooksList: []
        }

        this.requestRef = null
    }

 getRecievedBooksList = ()=>{
     this.requestRef = db.collection("requested_books").where('user_id','==','this.state.userId')
     .where('book_status','==','recieved')
     .onSnapshot((snapshot)=>{
        var recievedBooksList = snapshot.docs.map((doc)=>{
            doc.data()
        })
        this.setState({
           recievedBooksList: recievedBooksList 
        })
     })
 }

 componentDidMount = ()=>{
     this.getRecievedBooksList()
 }

 componentWillUnmount = ()=>{
     this.requestRef()
 }

 keyExtractor = (item,index)=>{
    index.toString()
 }

 renderItem = ({item,i})=>{
    console.log(item.book_name)
    return(
        <ListItem 
        key = {i}
        title = {item.book_name}
        subtitle = {item.bookStatus}
        titleStyle = {{color:'black',fontWeight:'bold'}}
        bottomDivider
        
        />
    )
 }

    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader
                title = "Received books"
                navigation = {this.props.navigation}
                />

                <View style = {{flex:1}}>
                    {
                        this.state.recievedBooksList.length === 0
                        ?(
                            <View style = {styles.subContainer}>
                                <Text style = {{fontSize:20}}>
                                    List of all received books
                                </Text>
                            </View>
                        )
                        :(
                            <FlatList
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.recievedBooksList}
                            renderItem = {this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({ subContainer:{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' },
    button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 } } 
})
