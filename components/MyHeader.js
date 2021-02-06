import React, {Component} from 'react';
import {Header,Icon,Badge} from 'react-native-elements';
import {View, Text} from 'react-native';
import db from '../config'

export default class MyHeader extends Component{
    constructor(props){
        super(props)
        this.state={
            value: ""
        }
    }

getNumberOfUnreadNotifications = ()=>{
    db.collection('all_notifications').where('notification_status','==',"unread")
    .onSnapshot((snapshot)=>{
        {var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
            this.setState({
                value: unreadNotifications.length
            })
        }
    })
}

componentDidMount = ()=>{
    this.getNumberOfUnreadNotifications()
}

BellIconWithBadge = ()=>{
    return(
        <View>
            <Icon name='Bell'
                type='font-awesome'
                color="green"
                size={25}
                onPress={()=>{
                    props.navigation.navigate('Navigation')
                }}/>

            <Badge value = {this.state.value}
                containerStyle = {{position: 'absolute',top:-4,right:-4}}
                />
        </View>
    )
}

    render(){
    return(
        <Header 
            leftComponent={
                <Icon name='Bars'
                type="font-awesome"
                color="green"
                onPress={()=>{
                    props.navigation.toggleDrawer()
                }}/>
            }
            centerComponent = {{text: props.title,
                style: {color: 'grey', fontSize: 20, fontWeight: 'bold',}}}

            rightComponent={
                <this.BellIconWithBadge{...this.props}/>
            }
             backgroundColor = 'cyan'/>
    )
 }
}