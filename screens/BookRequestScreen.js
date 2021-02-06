import React, {Component} from 'react';
import {TouchableHighlight, StyleSheet, Text,ScrollView, View, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books'
import {SearchBar,ListItem} from 'react-native-elements'
import {RFValue} from 'react-native-responsive-fontsize'

export default class BookRequestScreen extends Component{
    constructor(){
        super()
        this.state = {
            userId: firebase.auth().currentUser.email,
            bookName: "",
            reasonToRequest: "",
            IsBookRequestActive : "",
             requestedBookName: "",
         bookStatus:"",
        requestId:"",
         userDocId: '',
        docId :'',
         Imagelink: '',
        dataSource:"",
        showFlatlist: false,
        requestedImageLink: ''

        }
    }

    componentDidMount = ()=>{
       this.getBookRequest()
       this.getIsBookRequestActive()
}

renderItem = ({item,i})=>{
    var obj = {
        title: item.volumeInfo.title,
        selfLink: item.selfLink,
        byLink: item.saleInfo.byLink,
        imageLink: item.volumeInfo.imageLinks,
 }
 return(
     <TouchableHighlight
     style = {styles.touchableopacity}
     activeOpacity = {0.6}
     underlayColor = 'orange'
     onPress = {()=>{
         this.setState({
             showFlatList: false,
             bookName: item.volumeInfo.title
         })
     }}
     bottomDivider
     >
         <Text>{item.volumeInfo.title}</Text>
     </TouchableHighlight>
 )
}

    getBooksFromAPI = async (bookName)=>{
        this.setState({
            bookName: bookName
        })
        if(bookName.length > 2){
        var books = await BookSearch.searchbook(bookName,'AIzaSyA9O5KJuE285imJlzLxvPq5nF9hUlL2_os')
        this.setState({
            dataSource: books.data,
            showFlatList: true
        })
    }
    }

    createUniqueId = ()=>{
        return Math.random().toString(36).substring(7)
    }

    addRequest = async (bookName, reasonToRequest)=>{
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        var books = await BookSearch.searchbook(bookName,'AIzaSyA9O5KJuE285imJlzLxvPq5nF9hUlL2_os')
        db.collection('requested_books').add({
            "user_id": userId,
            "book_name": bookName,
            "reason_to_request": reasonToRequest,
            "request_id": randomRequestId,
            "book_status": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "image_link": books.data[0].volumeInfo.imageLinks.smallThumbnail
        })

    await this.getBookRequest()
    db.collection('users').where('email_id',"==",userId).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            db.collection('users').doc(doc.id).update({
                IsBookRequestActive: true
            })
        })
    })

        this.setState({
            bookName:'',
            reasonToRequest:'',
            requestId: randomRequestId
        })
        return alert("Book requested successfully")
    }

    getBookRequest = ()=>{
        var bookRequest = db.collection('requested_books').where(
            "user_id","==",this.state.userId).get().then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    if(doc.data().book_status !== "recieved"){
                        this.setState({
                            requestId: doc.data().request_id,
                            requestedBookNme: doc.data().book_name,
                            bookStatus: doc.data().book_status,
                            docId: doc.id,
                            requestedImageLink: doc.data().image_link
                        })
                    }
                })
            })
    }

    getIsBookRequestActive = ()=>{
        db.collection('users').where("email_id","==",this.state.userId).onSnapshot(querySnapshot => {
            querySnapshot.forEach((doc)=>{
                this.setState({
                    IsBookRequestActive: doc.data().IsBookRequestActive,
                    userDocId: doc.id
                })
            })
        })
    }

    updateBookRequestStatus = ()=>{
        db.collection('requested_books').doc(this.state.docId).update({
            book_status: 'recieved'
        })
        db.collection('users').where("email_id","==",this.state.userId).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    IsBookRequestActive: false
                })
            })
        })
    }

    sendNotification = ()=>{
        db.collection('users').where("email_id","==",this.state.userId).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().first_name
                var lastName = doc.data().last_name
                
                db.collection('all_notifications').where("request_id","==",this.state.requestId).get().then((snpshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorId = doc.data().donor_id
                        var bookName = doc.data().book_name

                        db.collection('all_notifications').add({
                            "targeted_user_id": donorId,
                            "message": name+" "+lastName+" recieved the book"+bookName,
                            "notification_status": "unread",
                            "book_name": bookName
                        })
                    })
                })
            })
        })
    }

    recievedBooks = (bookName)=>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection("recieved_books").add({
            "user_id": userId,
            "book_name": bookName,
            "request_id": requestId,
            "book_status": recieved
    })
}
render() {
    if (this.state.IsBookRequestActive === true) {
      return (
        <View style={{ flex: 1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Book Status" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            <Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />
          </View>
          <View
            style={styles.bookstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),

              }}
            >
              Name of the book
            </Text>
<Text
              style={styles.requestedbookName}
            >
              {this.state.requestedBookName}
            </Text>
            <Text
              style={styles.status}
            >
              Status
            </Text>
            <Text
              style={styles.bookStatus}
            >
              {this.state.bookStatus}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
              <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateBookRequestStatus();
                this.receivedBooks(this.state.requestedBookName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Book Recived
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Book Name"}
            placeholder={"Book name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => this.getBooksFromApi(text)}
            onClear={(text) => this.getBooksFromApi("")}
            value={this.state.bookName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
            ) : (
                <View style={{ alignItems: "center" }}>
                  <Input
                    style={styles.formTextInput}
                    containerStyle={{ marginTop: RFValue(30) }}
                    multiline
                    numberOfLines={8}
                    label={"Reason"}
                    placeholder={"Why do you need the book"}
                    onChangeText={(text) => {
                      this.setState({
                        reasonToRequest: text,
                      });
                    }}
                    value={this.state.reasonToRequest}
                  />
    <TouchableOpacity
                    style={[styles.button, { marginTop: RFValue(30) }]}
                    onPress={() => {
                      this.addRequest(
                        this.state.bookName,
                        this.state.reasonToRequest
                      );
                    }}
                  >
                    <Text
                      style={styles.requestbuttontxt}
                    >
                      Request
                    </Text>
                  </TouchableOpacity>
                  </View>
          )}
        </View>
      </View>
    );
  }

   
}

const styles = StyleSheet.create({
    keyBoardStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    formTextInput: {
      width: "75%",
      height: RFValue(35),
      borderWidth: 1,
      padding: 10,
    },
    ImageView:{
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center",
      marginTop:20
    },
  imageStyle:{
      height: RFValue(150),
      width: RFValue(150),
      alignSelf: "center",
      borderWidth: 5,
      borderRadius: RFValue(10),
    },
    bookstatus:{
      flex: 0.4,
      alignItems: "center",
  
    },
    requestedbookName:{
      fontSize: RFValue(30),
      fontWeight: "500",
      padding: RFValue(10),
      fontWeight: "bold",
      alignItems:'center',
      marginLeft:RFValue(60)
    },
    touchableopacity:{
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        width: "90%",
      },
      requestbuttontxt:{
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#fff",
      },
      button: {
        width: "75%",
        height: RFValue(60),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(50),
        backgroundColor: "#32867d",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
    shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
      },
    });
    