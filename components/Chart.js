import { useState } from 'react';
import { PieChart } from "react-native-gifted-charts";
import { View, Text } from "react-native";

const Dot = ({ color }) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color
        }}
      />
    );
  };

export const Chart = ({ data,  }) => {
    const [activeChartItem, setActiveChartItem] = useState(null);

    return (
        <View className="mx-auto flex flex-col items-center justify-center border border-primary-100 p-4 pb-12 mb-8 rounded-2xl w-full">
            <PieChart
                data={data}
                focusOnPress
                donut
                sectionAutoFocus
                innerCircleColor="#171717"
                onPress={(item) => setActiveChartItem(activeChartItem ? null : item)}
                centerLabelComponent={() => {
                    return activeChartItem && (
                        <View className="flex flex-col items-center jusitfy-center">
                            <Text className="text-white text-lg font-semibold mb-1">{activeChartItem?.text}</Text>
                            <Text className="text-white text-xs">{activeChartItem?.symbol}</Text>
                        </View>
                    );
                }}
            />

            <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4">
                {
                    data.map(item => (
                        <View className="flex flex-row gap-x-2 items-center" key={item?.color}>
                            <Dot color={item?.color} />
                            <Text className="text-white text-md">{item?.name}</Text>
                            <Text className="text-white text-md font-semibold">{item?.text}</Text>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}