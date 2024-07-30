import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

type CurrencyData = {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
};

type CurrencyDataRecord = Record<string, CurrencyData>;

const App = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyDataRecord | null>(
    null
  );

  const [refreshing, setRefreshing] = useState(false);

  const flagImages = {
    USD: require("../assets/images/flags/USD.png"),
    EUR: require("../assets/images/flags/EUR.png"),
    BTC: require("../assets/images/flags/BTC.png"),
    GBP: require("../assets/images/flags/GBP.png"),
    JPY: require("../assets/images/flags/JPY.png"),
    AUD: require("../assets/images/flags/AUD.png"),
    CAD: require("../assets/images/flags/CAD.png"),
    CHF: require("../assets/images/flags/CHF.png"),
    CNY: require("../assets/images/flags/CNY.png"),
    INR: require("../assets/images/flags/INR.png"),
    NZD: require("../assets/images/flags/NZD.png"),
    SEK: require("../assets/images/flags/SEK.png"),
    SGD: require("../assets/images/flags/SGD.png"),
  };

  const fetchCurrencyData = async () => {
    try {
      const response = await fetch(
        "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,JPY-BRL,AUD-BRL,CAD-BRL,CHF-BRL,CNY-BRL,INR-BRL,NZD-BRL,SEK-BRL,SGD-BRL"
      );
      const data = await response.json();
      setCurrencyData(data);
      setRefreshing(false);
    } catch (error) {
      console.error("Erro ao buscar os dados da API:", error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  const formatCurrency = (value: string) => {
    return parseFloat(value).toFixed(2).replace(".", ",");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencyData();
  };

  const renderCurrencyItem = ({ item }: { item: CurrencyData }) => {
    item.name = item.name.replace("/Real Brasileiro", "");

    const flag = (flagImages as Record<string, CurrencyDataRecord | undefined>)[
      item.code
    ];

    return (
      <View style={styles.item}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {item.name}
            <Text style={styles.mainprice}> R${formatCurrency(item.bid)}</Text>
          </Text>
          {flag && <Image source={flag} style={styles.flag} />}
        </View>
        <Text>
          Alta: <Text style={styles.high}>R${formatCurrency(item.high)}</Text>
        </Text>
        <Text>
          Baixa: <Text style={styles.low}>R${formatCurrency(item.low)}</Text>
        </Text>
        <Text>
          Compra: <Text style={styles.price}>R${formatCurrency(item.bid)}</Text>
        </Text>
        <Text>
          Venda: <Text style={styles.price}>R${formatCurrency(item.ask)}</Text>
        </Text>
      </View>
    );
  };

  const BRflag = require("../assets/images/flags/BRL.png");

  return (
    <View style={styles.container}>
      {currencyData ? (
        <FlatList
          style={{ width: "90%" }}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>
                Cotação BRL <Image source={BRflag} />
              </Text>
              <Text style={styles.subtitle}>Nas últimas 24 horas:</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          data={Object.values(currencyData)}
          renderItem={renderCurrencyItem}
          keyExtractor={(item) => item.code}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="black"
            />
          }
        />
      ) : (
        <ActivityIndicator size="large" color="#000000" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    width: "100%",
    height: "100%",
    margin: 0,
  },
  title: {
    fontSize: 28,
    marginTop: 40,
    marginBottom: 20,
    margin: "auto",
    fontWeight: "bold",
  },
  item: {
    padding: 20,
    backgroundColor: "#DDDEE1",
    borderRadius: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  flag: {
    width: 22,
    height: 17,
    marginLeft: 5,
  },
  name: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  high: {
    color: "#FF4B4A",
    fontSize: 16,
    fontWeight: "bold",
  },
  low: {
    color: "#059212",
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mainprice: {
    color: "#0F67B1",
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    margin: "auto",
    marginBottom: 20,
    color: "#000000",
  },
});

export default App;
