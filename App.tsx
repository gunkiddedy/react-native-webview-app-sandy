import React, { 
    useCallback, 
    useEffect, 
    useRef, 
    useState 
} from 'react'
import { 
    BackHandler, 
    ImageBackground, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StatusBar, 
    Text, 
    ToastAndroid, 
    View 
} from 'react-native'
import WebView from 'react-native-webview'
import NetInfo from '@react-native-community/netinfo'

function App() {
    const webViewRef = useRef(null)
    const [canGoBack, setCanGoBack] = useState(false)
    // const [canGoForward, setCanGoForward] = useState(false)
    // const [currentUrl, setCurrentUrl] = useState('')
    const [backPressed, setBackPressed] = useState(0)
    const [isConnected, setConnected] = useState(true)

    const handleBackPress = useCallback(() => {
        if (canGoBack) {
            webViewRef.current.goBack()
            return true // prevent exit app
        } else {
            showToast()
            return backPressed > 1 ? false : true
        }
    }, [canGoBack, backPressed])

    // listen for the hardware Back Press
    useEffect(() => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
            }
        }
    }, [handleBackPress])

    // check internet connections status
    useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setConnected(state.isConnected)
		})

		return () => {
			unsubscribe()
		}
	}, [isConnected])

    // show message with toast when pressed twice
    const showToast = () => {
        if (backPressed === 0) {
            setBackPressed(prevCount => prevCount + 1)
            setTimeout(() => setBackPressed(0), 2000)
            ToastAndroid.show('Klik lagi untuk keluar', ToastAndroid.SHORT)
        } else if (backPressed === 1) {
            BackHandler.exitApp()
        }
    }

    const URL = 'https://simpelnapi.kejarilomboktengah.id/'

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar 
                animated={true} 
                backgroundColor={'white'} 
                barStyle={'dark-content'} 
            />
            <ScrollView 
                contentContainerStyle={{ flex:1,}} 
                showsVerticalScrollIndicator={false}
            >
                {!isConnected && <OfflineScreen />}
                {/* <Text>canGoBack {canGoBack ? 'true' : 'false'}</Text>
                <Text>canGoForward {canGoForward ? 'true' : 'false'}</Text>
                <Text>currentUrl {currentUrl}</Text>
                <Text>backPressed {backPressed}</Text> */}
                {isConnected && <WebView
                    ref={webViewRef}
                    source={{ uri: URL }}
                    style={{ marginTop: 0 }}
                    sharedCookiesEnabled={true}
                    geolocationEnabled={true}
                    mediaPlaybackRequiresUserAction={false}
                    pullToRefreshEnabled={true}
                    bounces={true}
                    allowFileAccess={true}
                    onNavigationStateChange={(navState) => {
                        setCanGoBack(navState.canGoBack)
                        // setCanGoForward(navState.canGoForward)
                        // setCurrentUrl(navState.url)
                    }}
                    // startInLoadingState={true}
                    // renderLoading={() => <ActivityIndicator size="large" color="#00ff00" />}
                />}
            </ScrollView>
        </SafeAreaView>
    )
}

const OfflineScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal:20, paddingVertical:80, alignItems: 'center', }}>
            <ImageBackground 
                source={require('./assets/image/no_wifi_image.png')} 
                resizeMode="contain" 
                style={{ 
                    flex:1, 
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
            />
            <View>
                <Text style={{ color: 'black', fontSize:36, textAlign:'center',fontWeight:'bold' }}>
                    Oops!
                </Text>
                <Text style={{ color: 'black', fontSize:20, textAlign:'center' }}>
                    No Internet Connection, Please check your connection settings!
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default App
