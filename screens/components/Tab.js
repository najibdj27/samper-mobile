import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';


const Tab = ({keys, element}) => {   
    // console.log({...scene})
    
    const getRoutes = (titles) => {
        let routes = []
      
        titles.forEach(title => {
          routes.push({
            key: title,
            title: title
          })
        })
      
        return routes
    }

    const getSceneMap = (routes, scenes) => {
        let sceneMap = {}
        
        routes.forEach((route, index) => {
            sceneMap[route.key] = scenes[index]
        })
        
        return sceneMap
    }

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: '#D8261D' }}
            labelStyle={{
                fontWeight: "bold"
            }}
        />
    )

    const layout = useWindowDimensions();
    
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState(getRoutes(keys))
    
    const scene = element
    const sceneMap = getSceneMap(routes, scene)
    const renderScene = SceneMap(sceneMap);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
}

export default Tab