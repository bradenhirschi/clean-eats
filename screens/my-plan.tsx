import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import Toast from "react-native-root-toast";

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const MyPlanScreen = ({ navigation }: Props) => {
  const [commonAllergies, setCommonAllergies] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");

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
      try {
        const userId = await getUserID();

        await supabase
          .from("user_diets")
          .select("diet_name")
          .eq("user_id", userId)
          .then(({ data, error }) => {
            if (error) {
              throw new Error(`Error fetching user diet: ${error.message}`);
            }
            setSelectedDiets(data.map((item: any) => item.diet_name));
          });

        await supabase
          .from("common_allergies")
          .select("name")
          .then(({ data, error }) => {
            if (error) {
              throw new Error(
                `Error fetching common allergies: ${error.message}`
              );
            }
            setCommonAllergies(data.map((row) => row.name));
          });

        await supabase
          .from("user_allergies")
          .select("allergy_name")
          .eq("user_id", userId)
          .then(({ data, error }) => {
            if (error) {
              throw new Error(
                `Error fetching user allergies: ${error.message}`
              );
            }
            setSelectedAllergies(data.map((d) => d.allergy_name));
          });

        setLoading(false);
      } catch (err) {
        console.error("Error: ", err);
      }
    };
    fetchData();
  }, []);

  const toggleDietSelected = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter((item) => item !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  const toggleAllergySelected = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(
        selectedAllergies.filter((item) => item !== allergy)
      );
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const saveChanges = async () => {
    const userId = await getUserID();

    setLoading(true);

    // TODO BRADEN improve this, we're just deleting all diets then re-adding the ones we want
    const { error: cleanDietsError } = await supabase
      .from("user_diets")
      .delete()
      .eq("user_id", userId);
    if (cleanDietsError) console.error("Error removing diet(s)");

    // Insert new diets
    selectedDiets.map(async (diet) => {
      const { error } = await supabase
        .from("user_diets")
        .insert({ diet_name: diet });
      if (error) console.error("insert error", error);
      return;
    });

    // TODO BRADEN improve this, we're just deleting all allergies then re-adding the ones we want
    const { error: cleanAllergiesError } = await supabase
      .from("user_allergies")
      .delete()
      .eq("user_id", userId);
    if (cleanAllergiesError) console.error("Error removing allergies");

    // Insert new allergies
    selectedAllergies.map(async (allergy) => {
      const { error } = await supabase
        .from("user_allergies")
        .insert({ allergy_name: allergy });
      if (error) console.error("insert error", error);
      return;
    });

    setLoading(false);

    Toast.show("Plan updated successfully!", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
    });
  };

  return (
    <View className="flex-1 bg-gray-100 text-black">
      {/* Header */}
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">My Plan</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center p-8">
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View className="flex-1">
          {/* Diet plan buttons */}
          <View className="px-4">
            <Text>Diets</Text>
            <View className="flex-row justify-evenly flex-wrap mt-2">
              <View className="items-center p-2 bg-white rounded-md shadow-lg">
                <Pressable
                  className={`bg-gray-100 h-20 w-20 rounded-md flex items-center justify-center ${
                    selectedDiets.includes("vegan") && "bg-[#5e9e38]"
                  }`}
                  onPress={() => toggleDietSelected("vegan")}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={32}
                    color={selectedDiets.includes("vegan") ? "white" : "black"}
                  />
                </Pressable>
                <Text className="mt-2">Vegan</Text>
              </View>

              <View className="items-center p-2 bg-white rounded-md shadow-lg">
                <Pressable
                  className={`bg-gray-100 h-20 w-20 rounded-md flex items-center justify-center ${
                    selectedDiets.includes("keto") && "bg-[#5e9e38]"
                  }`}
                  onPress={() => toggleDietSelected("keto")}
                >
                  <Ionicons
                    name="sad-outline"
                    size={32}
                    color={selectedDiets.includes("keto") ? "white" : "black"}
                  />
                </Pressable>
                <Text className="mt-2">Keto</Text>
              </View>

              <View className="items-center p-2 bg-white rounded-md shadow-lg">
                <Pressable
                  className={`bg-gray-100 h-20 w-20 rounded-md flex items-center justify-center ${
                    selectedDiets.includes("paleo") && "bg-[#5e9e38]"
                  }`}
                  onPress={() => toggleDietSelected("paleo")}
                >
                  <Ionicons
                    name="fish-outline"
                    size={32}
                    color={selectedDiets.includes("paleo") ? "white" : "black"}
                  />
                  <Ionicons
                    name="egg-outline"
                    size={32}
                    color={selectedDiets.includes("paleo") ? "white" : "black"}
                  />
                </Pressable>
                <Text className="mt-2">Paleo</Text>
              </View>
            </View>
          </View>

          {/* Common allergy chips */}
          <View className="mt-12 px-4">
            <Text>Allergies</Text>
            {/* This margin top seems weird but is necessary */}
            <View className="flex-wrap flex-row gap-2 mt-0">
              {commonAllergies?.map((allergy) => (
                <View key={allergy}>
                  <Pressable
                    className={`border border-gray-300 rounded-2xl px-4 py-2 ${
                      selectedAllergies.includes(allergy) && "bg-[#5e9e38]"
                    }`}
                    onPress={() => toggleAllergySelected(allergy)}
                  >
                    <Text
                      className={` ${
                        selectedAllergies.includes(allergy) &&
                        "bg-[#5e9e38] text-white"
                      }
`}
                    >
                      {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Custom allergy input */}
          {/* <View className="items-center justify-center py-4">
        <Text className="text-red-700 text-sm mb-2">{error}</Text>
        <TextInput
          className="rounded-md h-8 w-60 py-4 px-4 m-2 border"
          placeholder="Enter custom allergy"
          value={allergyInput}
          onChangeText={(text) => setAllergyInput(text)}
        />
        <Pressable
          className="bg-[#5e9e38] rounded-lg px-4 py-2"
          onPress={() => toggleAllergySelected(allergyInput)}
        >
          <Text className="text-white">Create New Allergy</Text>
        </Pressable>
      </View> */}

          {/* Save changes button */}
          <View className="items-center mt-auto mb-12">
            <Pressable
              className="bg-[#5e9e38] rounded-lg px-4 py-2"
              onPress={saveChanges}
            >
              <Text className="text-white">Save changes</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default MyPlanScreen;
