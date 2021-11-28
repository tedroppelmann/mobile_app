import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
  } from 'react-native';
import {
    Box,
    Text,
    Heading,
    FlatList,
    HStack,
    VStack,
    Image,
    Center,
    Spinner,
    Button,
} from 'native-base';


export default function Recipes({ navigation, route }) {
    const [recipes, setRecipes] = useState("");
    const [recipes_min, setRecipesMin] = useState("");
    const [recipes_max, setRecipesMax] = useState("");

    const [loading, setLoading] = useState(false);

    const [isSelected, setSeleted] = useState(true);

    function transformIngredients(array) {
        let query = array.join();
        return query;
    }
    const ingredients = transformIngredients(route.params.selected)

    useEffect(() => {
        if (recipes_min == '' && recipes_max == '') {
            fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=80256361caf04b358f4cd2de7f094dc6&includeIngredients=${ingredients}&number=6&sort=min-missing-ingredients&fillIngredients=true&instructionsRequired=true`
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setRecipesMin(data);
                    setLoading(true);
                })
                .catch(() => {
                    console.log("error");
                });
            fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=80256361caf04b358f4cd2de7f094dc6&includeIngredients=${ingredients}&number=6&sort=max-used-ingredients&fillIngredients=true&instructionsRequired=true`
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setRecipesMax(data);
                    setLoading(true);
                })
                .catch(() => {
                    console.log("error");
                });
        } 
    },[]);

    const renderRecipes = ({ item, index }) => {
        const { id, title, image, missedIngredients, usedIngredientCount, missedIngredientCount } = item;

        return (
            <TouchableOpacity
            onPress={() => navigation.navigate('Recipe', { recipe_id: id, missed_ingredients: missedIngredients })}
            style= {[ styles.item ]}
            >
                <Box flex={1} >
                    <Image
                        style={styles.image}
                        source={{uri: image}}
                        alt={title}
                        key={title}
                    />
                    <Heading size='sm' mb='5' mt='2' textAlign='center'>
                    {title}
                    </Heading>
                </Box> 
                <Box>
                    <Heading size='xs' mb='2' mt='1' textAlign='center'>
                        Ingredients
                    </Heading>
                    <HStack mb='5' justifyContent= 'center'>
                        <VStack>
                            <Heading size='lg' textAlign='center' color='yellowgreen'>
                                {usedIngredientCount}
                            </Heading>
                            <Text textAlign='center'>
                                used
                            </Text>
                        </VStack>
                        <VStack ml='8'>
                            <Heading size='lg' textAlign='center' color='tomato'>
                                {missedIngredientCount}
                            </Heading>
                            <Text textAlign='center'>
                                missed
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
            </TouchableOpacity>
        );
    };

    let color_left = '#f5f5f4';
    let color_right = 'gray.500';
    if (isSelected){
        color_left = '#f5f5f4';
    } else {
        color_left = 'gray.500';
        color_right = '#f5f5f4';
    }

    if (!loading) {
        return (
            <Center flex={1}>
                <Spinner/>
            </Center>
        )
      }
    
    return (
        <Center flex={1}>
                <Box w="95%" mx="auto" mb='5'>
                    <FlatList
                        ListHeaderComponent={
                            <HStack>
                                <TouchableOpacity
                                    delayPressIn={0}
                                    activeOpacity={1}
                                    onPress={() => {setSeleted(true)}}
                                    style={[styles.category_left, isSelected && { backgroundColor: '#50C878', borderColor: '#50C878'}]}
                                >
                                    <Heading size='sm' textAlign='center' color={color_left}>
                                        Less missed
                                    </Heading>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    delayPressIn={0}
                                    activeOpacity={1}
                                    onPress={() => {setSeleted(false)}}
                                    style={[styles.category_right, !isSelected && { backgroundColor: '#50C878', borderColor: '#50C878'}]}
                                >
                                    <Heading size='sm' textAlign='center' color={color_right}>
                                        More used
                                    </Heading>
                                </TouchableOpacity>
                            </HStack>
                        }
                        showsVerticalScrollIndicator={false}
                        data={ isSelected ? recipes_min.results : recipes_max.results}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipes}
                        numColumns={2}
                    />
                </Box>
        </Center>
    )
}

const styles = StyleSheet.create({

    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }, 

    item: {
        flex: 1/2,
        marginRight: 5,
        marginLeft: 5,
        marginTop: 10,
        marginBottom: 0,
        borderRadius: 20,

        backgroundColor: '#f5f5f4',
        /*
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 7,*/
    },

    category_left: {
        flex: 1/2,
        marginLeft: 5,
        height: 40,
        marginTop: 20,
        marginBottom: 10,

        backgroundColor: '#f5f5f4',

        borderWidth: 3,
        borderColor: '#f5f5f4',
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,

        justifyContent: 'center',
    },
    category_right: {
        flex: 1/2,
        marginRight: 5,
        height: 40,
        marginTop: 20,
        marginBottom: 10,

        backgroundColor: '#f5f5f4',

        borderWidth: 3,
        borderColor: '#f5f5f4',
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,

        justifyContent: 'center',
    },
});