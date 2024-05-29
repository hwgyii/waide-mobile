import { Box, Button, ButtonIcon, ButtonText, ChevronLeftIcon, Fab, Pressable, ScrollView, Spinner, Text } from "@gluestack-ui/themed";
import { Heading, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Textarea, TextareaInput } from "@gluestack-ui/themed";
import { SafeAreaView } from "@gluestack-ui/themed";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as api from "../../../utilities/api";
import { get, isEmpty, set } from "lodash";
import { AntDesign, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import OrderModal from "./OrderModal";
import InventoryCard from "./InventoryCard";
import dayjs from "dayjs";

const { height } = Dimensions.get("window");

export default function EstablishmentPage({ establishmentId, setComponent }) {
  const [establishment, setEstablishment] = useState({});
  const [inventories, setInventories] = useState([]);
  const [tables, setTables] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const [componentToRender, setComponentToRender] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);

  function EstablishmentOverView() {
    return (
      <ScrollView
        style={{
          height: `calc(${height}px - 300px)`,
          marginBottom: 275,
        }}
      >
        {
          get(establishment.settings, "inventoryEnabled", false) && (
            <Pressable onPress={() => setComponentToRender("inventories")}>
              <Box
                sx={{
                  height: 75,
                  width: "100%",
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgColor: "pink",
                }}
              >
                <Text fontSize={20} fontWeight={"bold"} marginLeft={10} >Inventories</Text>
                <Box marginRight={10}>
                  <MaterialIcons name="chevron-right" size={30} />
                </Box>
              </Box>
            </Pressable>
          )
        }
        {
          get(establishment.settings, "invoiceEnabled", false) && (
            <Pressable onPress={() => setComponentToRender("invoices")}>
              <Box
                sx={{
                  height: 75,
                  width: "100%",
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgColor: "pink",
                }}
              >
                <Text fontSize={20} fontWeight={"bold"} marginLeft={10} >Invoices</Text>
                <Box marginRight={10}>
                  <MaterialIcons name="chevron-right" size={30} />
                </Box>
              </Box>
            </Pressable>
          )
        }
        {
          get(establishment.settings, "tablesEnabled", false) && (
            <Pressable onPress={() => setComponentToRender("tables")}>
              <Box
                sx={{
                  height: 75,
                  width: "100%",
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgColor: "pink",
                }}
              >
                <Text fontSize={20} fontWeight={"bold"} marginLeft={10} >Tables</Text>
                <Box marginRight={10}>
                  <MaterialIcons name="chevron-right" size={30} />
                </Box>
              </Box>
            </Pressable>
          )
        }
        <Pressable onPress={() => setComponentToRender("reviews")}>
          <Box
            sx={{
              height: 75,
              width: "100%",
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              bgColor: "pink",
            }}
          >
            <Text fontSize={20} fontWeight={"bold"} marginLeft={10} >Reviews</Text>
            <Box marginRight={10}>
                  <MaterialIcons name="chevron-right" size={30} />
                </Box>
          </Box>
        </Pressable>
      </ScrollView>
    );
  }
  
  function EstablishmentInventories({ inventories }) {
    const [orders, setOrders] = useState({});
    const [selectedInventories, setSelectedInventories] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
      if (Object.keys(orders).length === 0) return ;
      let total = 0;
      let count = 0;
      for (const key in orders) {
        if (Object.hasOwnProperty.call(orders, key)) {
          const order = orders[key];
          total += order.price * order.orderSize;
          count += order.orderSize;
        }
      }
      setTotalPrice(total);
      setSelectedInventories(count);
    }, [orders]);

    const onSetOrder = (order) => {
      setOrders((prev) => {
        if (order.orderSize === 0) {
          return (
            Object.keys(prev).reduce((acc, key) => {
              if (key !== order._id) {
                acc[key] = prev[key];
              }
              return acc;
            }, {})
          )
        }
        return {
          ...prev,
          [order._id]: order,
        }
      });
    };
  
    const onClearOrders = () => {
      setOrders({});
      setSelectedInventories(0);
      setTotalPrice(0);
    };

    return (
      <>
        {
          get(establishment.settings, "deliveryEnabled", false) && (
            <OrderModal establishment={establishment} orders={orders} selectedInventories={selectedInventories} totalPrice={totalPrice} onClearOrders={onClearOrders} setInventories={setInventories} />
          )
        }
        <ScrollView
          style={{
            height: `calc(${height}px - 300px)`,
            marginBottom: 275,
          }}
        >
          {
            inventories.length > 0
              ?
                inventories.map((inventory, index) => (
                  <InventoryCard inventory={inventory} establishment={establishment} order={orders[inventory._id]} onSetOrder={onSetOrder} key={index}/>
                ))
              :
                <Box
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ marginTop: "50%" }}>No Inventories found.</Text>
                </Box>
        }
        </ScrollView>
        
      </>
    );
  }
  
  function EstablishmentInvoices({ invoices }) {
    return (
      <ScrollView
        style={{
          height: `calc(${height}px - 300px)`,
          marginBottom: 275,
        }}
      >
        {
          invoices.length > 0
            ?
              invoices.map((invoice) => (
                <Box
                  key={invoice._id}
                  sx={{
                    height: 115,
                    width: "100%",
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgColor: "pink",
                  }}
                >
                  <Box
                    sx={{
                      width: "75%",
                      flexDirection: "column",
                      marginLeft: 10,
                    }}
                  >

                    <Text fontSize={20} fontWeight={"bold"} >{invoice.name} - Php {invoice.price}</Text>
                    <Text fontSize={14} >{invoice.description}</Text>
                  </Box>
                </Box>
              ))
            :
              <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginTop: "50%" }}>No Invoices found.</Text>
              </Box>
      }
      </ScrollView>
    );
  }
  
  function EstablishmentTables({ tables }) {
    const AVAILABILITY = {
      0: "Available",
      1: "Occupied",
      2: "Reserved",
    };

    return (
      <ScrollView
        style={{
          height: `calc(${height}px - 300px)`,
          marginBottom: 275,
        }}
      >
        {
          tables.length > 0
            ?
              tables.map((table) => (
                <Box
                  key={table._id}
                  sx={{
                    height: 75,
                    width: "100%",
                    marginTop: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgColor: "pink",
                  }}
                >
                  <Text fontSize={20} fontWeight={"bold"} marginLeft={10} >{table.name}</Text>
                  <Text fontSize={20} fontWeight={"bold"} marginRight={10} >{AVAILABILITY[table.availability]}</Text>
                </Box>
              ))
            :
              <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginTop: "50%" }}>No Tables found.</Text>
              </Box>
        }
      </ScrollView>
    );
  }
  
  function EstablishmentReviews({ reviews }) {

    function ReviewModal() {
      const [showModal, setShowModal] = useState(false);
      const ref = useRef(null);
      const [review, setReview] = useState("");
      const [rating, setRating] = useState(1);

      const onAddReview = async () => {
        try {
          const response = await api.addReview({ body:  { establishmentId, review, rating } });
          if (response.status === 200) {
            alert(response.data.message);
            setReviews([...reviews, response.data.review]);
            setReview("");
            setRating(1);
            setShowModal(false);
          }
        } catch (error) {
          console.error(error);
        }
      };

      return (
        <>
          <Fab
            size={"lg"}
            placement={"top right"}
            onPress={() => setShowModal(true)}
          >
            <MaterialIcons name="rate-review" size={24} color="black" />
          </Fab>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} finalFocusRef={ref} sx={{ height: "100%"}}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size='lg'>Add a Review</Heading>
              <ModalCloseButton><Text underline={true} color="red">Close</Text></ModalCloseButton>
            </ModalHeader>
            <ModalBody
            >
              <Box
                sx={{
                  width: "100%",
                  flexDirection: "column",
                  marginTop: 10,
                }}
              >
                <Box
                  sx={{
                    width: "75%",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  { rating < 1 ? <Ionicons name="star-outline" size={30} onPress={() => setRating(1)}/> : <Ionicons name="star-sharp" size={30} onPress={() => setRating(1)}/> }
                  { rating < 2 ? <Ionicons name="star-outline" size={30} onPress={() => setRating(2)}/> : <Ionicons name="star-sharp" size={30} onPress={() => setRating(2)}/> }
                  { rating < 3 ? <Ionicons name="star-outline" size={30} onPress={() => setRating(3)}/> : <Ionicons name="star-sharp" size={30} onPress={() => setRating(3)}/> }
                  { rating < 4 ? <Ionicons name="star-outline" size={30} onPress={() => setRating(4)}/> : <Ionicons name="star-sharp" size={30} onPress={() => setRating(4)}/> }
                  { rating < 5 ? <Ionicons name="star-outline" size={30} onPress={() => setRating(5)}/> : <Ionicons name="star-sharp" size={30} onPress={() => setRating(5)}/> }
                </Box>
                <Textarea>
                  <TextareaInput placeholder="Add a review" value={review} onChangeText={(value) => {setReview(value)}} />
                </Textarea>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Box
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button onPress={() => {setReview(""); setShowModal(false); setRating(1);}} action="negative" marginRight={25}>
                  <ButtonText>Clear</ButtonText>
                </Button>
                <Button onPress={onAddReview} action="primary" disabled={rating === 0 && isEmpty(review)}>
                  <ButtonText>Add Review</ButtonText>
                </Button>
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </>
      );
    }

    return (
      <>
        <ReviewModal />
        <ScrollView
          style={{
            height: `calc(${height}px - 300px)`,
            marginBottom: 275,
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
                      }}
                    >
                      <Box
                        sx={{
                          width: "50%",
                        }}
                      >
                        <Text marginLeft={10} fontSize={16}>{review.user.fullName}</Text>
                      </Box>
                      <Text marginRight={10} fontSize={16}>{dayjs(review.createdAt).format("DD/MM/YYYY")}</Text>
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
      </>
    );
  }

  const renderComponents = () => {
    switch (componentToRender) {
      case "inventories":
        return <EstablishmentInventories inventories={inventories} />;
      case "invoices":
        return <EstablishmentInvoices invoices={invoices} />;
      case "tables":
        return <EstablishmentTables tables={tables} />;
      case "reviews":
        return <EstablishmentReviews reviews={reviews} />;
      case "overview":
        return <EstablishmentOverView />;
      default:
        return <EstablishmentOverView />;
    }
  };

  const onBack = (e) => {
    try {
      e.preventDefault();
      if (componentToRender !== "overview") setComponentToRender("overview");
      else setComponent("Establishments");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEstablishment = async () => {
    try {
      const response = await api.getEstablishment({ establishmentId });
      if (response.status === 200) {
        setEstablishment(response.data.establishment);
        setInventories(response.data.inventories);
        setTables(response.data.tables);
        setInvoices(response.data.invoices);
        setReviews(response.data.reviews);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEstablishment();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return ;
    let total = 0;
    for (let i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }
    setAverageRating(total / reviews.length);
  }, [reviews]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Box
          sx={{
            marginLeft: 10,
            marginTop: 15,
          }}
        >
          {/* Back Button */}
          <Button 
            sx={{
              bgColor: "#F00B51",
              width: 42,
            }}
            onPress={(e) => {onBack(e)}}
          >
            <ButtonIcon as={ChevronLeftIcon} />
          </Button>
        </Box>
        {
          isLoaded
            ?
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "80%",
                    marginLeft: 10,
                    justifyContent: "center",
                    height: 150,
                  }}
                >
                  <Text fontSize={24} fontWeight={"bold"} >{establishment.name}</Text>
                  <Text fontSize={20}>{establishment.operatingHours}</Text>
                  <Text fontSize={16} marginTop={10}>{establishment.address}</Text>
                  <Text fontSize={12} marginTop={10}>Average Rating: {averageRating.toFixed(2)}/5 by {reviews.length} reviews.</Text>
                </Box>
                {renderComponents()}
              </Box>
            :
            <Box
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-20%",
              }}
            >
              <Spinner size={"xl"} style={{ height: 100, width: 100, }} />
            </Box>
        }
      </SafeAreaView>
    </GestureHandlerRootView>
  )
};