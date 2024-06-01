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
    StatusBar, 
    Text, 
    ToastAndroid, 
    TouchableOpacity, 
    View 
} from 'react-native'
import WebView from 'react-native-webview'
import { fetch } from '@react-native-community/netinfo'

function App() {
    const SIMPLE_NAPI_BASE_URL = 'https://simpelnapi.kejarilomboktengah.id/'
    const webViewRef = useRef(null)
    const [canGoBack, setCanGoBack] = useState(false)
    // const [canGoForward, setCanGoForward] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('')
    const [backPressed, setBackPressed] = useState(0)
    const [isConnected, setConnected] = useState(true)

    // handle hardware back press
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

    // Get the network state once:
    const fetchConnection = () => {
        console.log('fetchConnection...')
        fetch().then(state => {
            setConnected(state.isConnected)
        })
    }

    // check internet connections status
    useEffect(() => {
		fetchConnection()
	}, [handleBackPress, currentUrl])

    // show message with toast when hardware back pressed twice
    const showToast = () => {
        if (backPressed === 0) {
            setBackPressed(prevCount => prevCount + 1)
            setTimeout(() => setBackPressed(0), 2000)
            ToastAndroid.show('Klik lagi untuk keluar', ToastAndroid.SHORT)
        } else if (backPressed === 1) {
            BackHandler.exitApp()
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar 
                animated={true} 
                backgroundColor={'white'} 
                barStyle={'dark-content'} 
            />
            {!isConnected && <OfflineScreen onReload={() => fetch().then(state => {setConnected(state.isConnected)})} />}
            {isConnected && 
                <WebView
                    ref={webViewRef}
                    source={{ uri: SIMPLE_NAPI_BASE_URL }}
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
                        setCurrentUrl(navState.url)
                    }}
                    // startInLoadingState={true}
                    // renderLoading={() => <ActivityIndicator size="large" color="#00ff00" />}
                />
            }
        </SafeAreaView>
    )
}

const OfflineScreen = ({onReload}) => {
    return (
        <SafeAreaView style={{ 
            flex: 1, 
            backgroundColor: '#fff', 
            paddingHorizontal:10, 
            paddingVertical:30, 
            alignItems: 'center', 
            justifyContent: 'space-between',
        }}>
            <ImageBackground 
                source={require('./assets/image/404.jpg')} 
                resizeMode="contain" 
                style={{ 
                    flex:1, 
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <View style={{ position: 'absolute', bottom:50, alignSelf: 'center' }}>
                    <View style={{ paddingHorizontal:20, }}>
                        <Text style={{ 
                            color: '#73849f', 
                            fontSize:36, 
                            textAlign:'center', 
                            fontWeight:'bold', 
                        }}>
                            Oops!
                        </Text>
                        <Text style={{ 
                            color: '#8793a5', 
                            fontSize:20, 
                            textAlign:'center',
                        }}>
                            No Internet Connection, Please check your connection settings!
                        </Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => onReload()}
                        style={{ 
                            marginTop:10,
                            paddingVertical:12,
                            backgroundColor: '#17262c',
                            alignItems: 'center',
                            borderRadius: 50,
                        }}
                    >
                        <Text style={{ 
                            fontSize:20, 
                            color: '#f2f2f2', 
                            fontWeight: '700'
                        }}>
                            Refresh
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            
        </SafeAreaView>
    )
}

export default App
