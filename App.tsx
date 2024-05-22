import React, { useEffect, useRef } from 'react'
import { BackHandler, Platform, SafeAreaView } from 'react-native'
import WebView from 'react-native-webview'

function App() {
    const webViewRef = useRef(null)

    const onAndroidBackPress = () => {
        if (webViewRef.current) {
            webViewRef.current.goBack()
            return true // prevent default behavior (exit app)
        }
        return false
    }

    useEffect(() => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress)
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress)
            }
        }
    }, [])

    const URL = 'https://simpelnapi.kejarilomboktengah.id/admin/beranda'
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: URL }}
                style={{ marginTop: 0 }}
                onLoadStart={(event) => {
                    console.log("onLoadStart", event.nativeEvent)
                    // Alert.alert('test')
                }}
                sharedCookiesEnabled={false}
            />
        </SafeAreaView>
    )
}

export default App
