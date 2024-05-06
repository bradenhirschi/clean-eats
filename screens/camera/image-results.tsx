import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { supabase } from "../../utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

interface NutrientContents {
  sodium: number;
  sugars: number;
  fat: number;
}

interface Props {
  route: { params: { barcodeData: string } };
}

const ImageResultsScreen = ({ route }: Props) => {
  const upc = JSON.parse(route.params.barcodeData).data;
  let backupUpc: string;

  const [foodItem, setFoodItem] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [allergicIngredients, setAllergicIngredients] = useState<string[]>();
  const [forbiddenFoods, setForbiddenFoods] = useState<string[]>();

  const getUserID = async () => {
    try {
      const id = await supabase.auth.getUser().then((res) => res.data.user?.id);
      if (id) {
        return id;
      }
    } catch (error) {
      console.log("Error getting User ID:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch food data from USDA FoodData
      if (upc.length === 13) {
        backupUpc = upc.substring(1);
      }
      const fetchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc} ${backupUpc}&dataType=Branded&pageSize=1&api_key=hFNCTd2GoN19BAc9JS8gM6JwL1p8SQccGHJgnQlQ`;
      const res = await fetch(fetchUrl);
      const data = await res.json();

      // Get user's allergies and diet plan forbidden foods
      let userAllergies: string[] = [];
      let userDietForbiddenFoods: string[] = [];
      const userId = await getUserID();
      try {
        await supabase
          .from("user_allergies")
          .select("allergy_name, common_allergies (included_allergies)")
          .eq("user_id", userId)
          .then(({ data, error }) => {
            if (error) {
              throw new Error(
                `Error fetching user allergies: ${error.message}`
              );
            }

            // This looks terrible but so far its my best idea.
            // It maps to get all the user's "common allergies" and those included allergies in one array
            userAllergies = data
              .map((d) => {
                return [
                  ...new Set(
                    [
                      d.allergy_name,
                      // @ts-ignore
                      d.common_allergies.included_allergies,
                    ].flat()
                  ),
                ];
              })
              .flat();
          });

        await supabase
          .from("user_diets")
          .select("diet_name, diets (forbidden_foods)")
          .eq("user_id", userId)
          .then(({ data, error }) => {
            if (error) {
              throw new Error(
                `Error fetching user diet plan data: ${error.message}`
              );
            }

            userDietForbiddenFoods = data
              .map((d) => {
                return [
                  ...new Set(
                    [
                      d.diet_name,
                      // @ts-ignore
                      d.diets.forbidden_foods,
                    ].flat()
                  ),
                ];
              })
              .flat();
          });
      } catch (err) {
        console.error(err);
      }

      // Parse food data
      if (data.foods && data.foods.length > 0) {
        const firstFoodItem = data.foods[0];
        setFoodItem(firstFoodItem);
        setLoading(false);

        parseAllergicIngredients(userAllergies, firstFoodItem);
        parseDietForbiddenFoods(userDietForbiddenFoods, firstFoodItem);

        parseNutrients(firstFoodItem);

        // Store item in history
        const { data: historyData, error: historyError } = await supabase
          .from("user_history")
          .insert({
            upc: upc,
            brand_name: firstFoodItem.brandName,
            product_name: firstFoodItem.description,
          });
        if (historyError) {
          console.error(historyError);
        } else {
          console.log(historyData);
        }
      } else {
        // If no foods found
        console.log("No food items found");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const parseAllergicIngredients = (
    userAllergies: string[],
    firstFoodItem: any
  ) => {
    let newAllergicIngredients: string[] = [];
    userAllergies.map((allergy) => {
      if (firstFoodItem.ingredients.toLowerCase().includes(allergy)) {
        newAllergicIngredients.push(allergy);
      }
    });
    setAllergicIngredients(newAllergicIngredients);
  };

  const parseDietForbiddenFoods = (
    forbiddenFoods: string[],
    firstFoodItem: any
  ) => {
    let newForbiddenFoods: string[] = [];
    forbiddenFoods.map((food) => {
      if (firstFoodItem.ingredients.toLowerCase().includes(food)) {
        newForbiddenFoods.push(food);
      }
    });
    setForbiddenFoods(newForbiddenFoods);
  };

  const parseNutrients = (firstFoodItem: any) => {
    const trackedNutrients = ["Protein", "Total Sugars", "Sodium, Na"];

    firstFoodItem.foodNutrients.map((nutrient: any) => {
      if (trackedNutrients.includes(nutrient.nutrientName)) {
        console.log(nutrient.nutrientName, nutrient.percentDailyValue);
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (!loading && !foodItem) {
    return (
      <View className="flex-1 p-8">
        <View className="flex flex-row items-center justify-center p-4 mt-2 rounded-lg bg-red-700/30">
          <Ionicons name={"alert-circle-outline"} size={32} color="#b91c1c" />
          <Text className="text-red-700 ml-2">
            No food items found. Try again
          </Text>
        </View>
      </View>
    );
  }

  return (
    
    <ScrollView className="flex-1 p-8 h-[650px] max-h-[650px]">
      <View className="border-b border-gray-300 pb-2">
        <Text className="font-bold text-xl capitalize">
          {foodItem.description.toLowerCase() || ""}
        </Text>
        <Text className="text-gray-500 text-sm capitalize">
          {foodItem.brandName.toLowerCase() || "Unbranded"}
        </Text>
      </View>
      <View className="py-2">
        <Text className="font-semibold text-lg">Ingredients</Text>
        <Text className="mb-2 capitalize">
          {foodItem.ingredients.toLowerCase()}
        </Text>
        {allergicIngredients && allergicIngredients.length > 0 && (
          <View className="flex flex-row justify-center p-4 mt-2 rounded-lg bg-red-700/30">
            <Ionicons name={"alert-circle-outline"} size={32} color="#b91c1c" />
            <View className="flex-col ml-2">
              <Text className="text-red-700 mb-1">
                WARNING: this food includes ingredients you may be allergic to,
                including:
              </Text>
              {allergicIngredients?.map((ingredient) => (
                <Text className="text-red-700 capitalize">
                  &#x2022; {ingredient}
                </Text>
              ))}
            </View>
          </View>
        )}

        {forbiddenFoods && forbiddenFoods.length > 0 && (
          <View className="flex flex-row justify-center p-4 mt-2 rounded-lg bg-red-700/30">
            <Ionicons name={"alert-circle-outline"} size={32} color="#b91c1c" />
            <View className="flex-col ml-2">
              <Text className="text-red-700 mb-1">
                WARNING: this food includes ingredients forbidden by your diet
                plan(s), including:
              </Text>
              {forbiddenFoods?.map((food) => (
                <Text className="text-red-700 capitalize">&#x2022; {food}</Text>
              ))}
            </View>
          </View>
        )}

        {!allergicIngredients?.length && !forbiddenFoods?.length && (
          <View className="flex flex-row items-center justify-center p-4 mt-2 rounded-lg bg-lime-700/30">
            <Ionicons name={"happy-outline"} size={32} color="#4d7c0f" />
            <Text className="text-lime-700 ml-2">
              This food contains none of your selected allergens. Enjoy!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ImageResultsScreen;
