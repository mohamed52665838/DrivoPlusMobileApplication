


import React, { useEffect, useState } from 'react'
import {TouchableOpacity, View} from 'react-native'
import { Icon, Text } from 'react-native-paper';

function AlertComponentRecord({onClick}: {onClick?: () => void}) {

    const [isBackgroundRed, setIsBackgroundRed] = useState(false)

    useEffect(() => {
      const interval = setInterval(() => {
        setIsBackgroundRed((value) => ! value)
      }, 1000);
        return () => {
            clearInterval(interval)
        }
    }, []);

    
  return (
    <TouchableOpacity onPress={onClick} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: isBackgroundRed ? '#ff000032' : '#ffffff00', width: '100%', height: '50%', position: 'absolute', zIndex: 2 }}>
        <Text variant='headlineLarge' style={{color: 'red'}}>
                Pay attention, drive safe!
        </Text>
    </TouchableOpacity>
  )
}

export default AlertComponentRecord
