import { Box, CircleIcon, SafeAreaView, ScrollView, Spinner } from "@gluestack-ui/themed";
import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";

import * as api from "../utilities/api";
import dayjs from "dayjs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Reviews() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useFocusEffect(useCallback(() => {
    const getReviews = async () => {
      try {
        const response = await api.getReviews();

        if (response.status === 200) {
          setReviews(response.data.reviews);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getReviews();
  }, []));

  useEffect(() => {
    if (reviews.length > 0) {
      let totalRating = 0;
      reviews.forEach((review) => {
        totalRating += review.rating;
      });
      setAverageRating(totalRating / reviews.length);
    }
  }, [reviews]);
  return (
    <GestureHandlerRootView>
      <SafeAreaView
        sx={{
          width: "100%",
          height: "100%",
        }}
      >

        {
          isLoaded
            ?
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 32, fontWeight: "bold" }}>REVIEWS</Text>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: 10,
                    marginLeft: 15,
                  }}
                >
                  <Text fontSize={12} >Average Rating: {averageRating.toFixed(2)}/5 by {reviews.length} reviews.</Text>
                </Box>
                <ScrollView
                  style={{
                    marginBottom: 10,
                  }}
                >
                  {
                    reviews.length > 0
                      ?
                        reviews.map((review) => (
                          <Box
                            key={review._id}
                            sx={{
                              width: "100%",
                              marginTop: 10,
                              bgColor: "pink",
                            }}
                          >
                            <Box
                              sx={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 5,
                                marginTop: 5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "50%",
                                }}
                              >
                                <Text marginLeft={10} fontSize={16}>{review.user.fullName}</Text>
                              </Box>
                              <Text marginRight={10} fontSize={16}>{dayjs(review.createdAt).add(8, "hours").format("DD/MM/YYYY")}</Text>
                            </Box>
                            <Box
                              sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                                marginLeft: 10,
                              }}
                            >
                              { review.rating < 1 ? <Ionicons name="star-outline" size={30}/> : <Ionicons name="star-sharp" size={30}/> }
                              { review.rating < 2 ? <Ionicons name="star-outline" size={30}/> : <Ionicons name="star-sharp" size={30}/> }
                              { review.rating < 3 ? <Ionicons name="star-outline" size={30}/> : <Ionicons name="star-sharp" size={30}/> }
                              { review.rating < 4 ? <Ionicons name="star-outline" size={30}/> : <Ionicons name="star-sharp" size={30}/> }
                              { review.rating < 5 ? <Ionicons name="star-outline" size={30}/> : <Ionicons name="star-sharp" size={30}/> }
                            </Box>
                            <Text textAlign={"justify"} fontSize={20} marginLeft={10} marginRight={10} marginBottom={10}>{review.review}</Text>
                          </Box>
                        ))
                      :
                        <Box
                          sx={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ marginTop: "50%" }}>No Reviews found.</Text>
                        </Box>
                  }
                </ScrollView>
              </Box>
            :
              <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner size={"xl"} style={{ height: 100, width: 100, marginTop: "50%" }} />
              </Box>
        }
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};