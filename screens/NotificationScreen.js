import React,{Component} from 'react'
import {View,Text} from 'react-native'
import MyHeader from '../components/MyHeader'
import SwipeableFlatlist from '../components/SwipeableFlatlist'
import db from '../config'

export default class NotificationScreen extends Component{
    constructor(props){
        super(props)
        this.state={
            userId: firebase.auth().currentUser.email,
            allNotifications: []
        }
        this.notificationRef = null
    }

getNotifications = ()=>{
    this.requestRef = db.collection("all_notifications")
    .where("notification_status","==","unread")
    .where("targeted_user_id","==",this.state.userId)
    .onSnapshot((snapshot)=>{
        var allNotifications = []
        snapshot.docs.map((doc)=>{
            var notification = doc.data()
            notification["doc_id"] = doc.id
            allNotifications.push(notification)
        })
        this.setState({
            allNotifications: allNotifications
        })
    })
}

componentDidMount = ()=>{
    this.getNotifications()
}

componentWillUnmount = ()=>{
    this.notificationRef()
}

keyExtractor = (item, index)=>{
    index.toString()
}

renderItem = ({item, index})=>{
    return(
        <ListItem 
        key={index}
        leftElement={
            <Icon 
            name="Book"
            type="font-awesome"
            color="blue"/>
        }
        title={item.book_name}
        titleStyle={{color: 'black', fontWeight: 'bold'}}
        subtitle={item.message}
        bottomDivider/>
    )
}

    render(){
        return(
            <View style = {{flex:1}}>

                <View style={{flex:0.1}}>
                    <MyHeader
                    title={"Notifictions"}
                    navigation={this.props.navigation}/>
                </View>

                <View style={{flex:0.9}}>
                    {this.state.allNotifications.length === 0
                    ?(<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:25}}>You have no notifications</Text>
                    </View>
                        ):(<SwipeableFlatlist allNotifications = {this.state.allNotifications}/>)
                    }
                </View>
                
            </View>
        )
    }
}
