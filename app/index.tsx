import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

// Definindo o tipo CurrencyData
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

// Definindo o tipo de objeto CurrencyDataRecord como um registro de moedas
type CurrencyDataRecord = Record<string, CurrencyData>;

const App = () => {
  // Estado para armazenar dados das moedas
  const [currencyData, setCurrencyData] = useState<CurrencyDataRecord | null>(
    null
  );
  // Estado para controlar o estado de "refreshing" da lista
  const [refreshing, setRefreshing] = useState(false);

  // Mapeamento de códigos de moedas para imagens de bandeiras
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

  // Função para buscar dados das moedas da API
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

  // Efeito para carregar os dados quando o componente é montado
  useEffect(() => {
    fetchCurrencyData();
  }, []);

  // Função para formatar números de moeda para duas casas decimais
  const formatCurrency = (value: string) => {
    return parseFloat(value).toFixed(2).replace(".", ",");
  };

  // Função para atualizar a lista quando o usuário faz o "pull-to-refresh"
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencyData();
  };

  // Função para renderizar cada item da lista de moedas
  const renderCurrencyItem = ({ item }: { item: CurrencyData }) => {
    // Remover "/Real Brasileiro" do nome da moeda para apresentação
    item.name = item.name.replace("/Real Brasileiro", "");

    // Obter a imagem da bandeira com base no código da moeda
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
          Alta: <Text style={styles.alta}>R${formatCurrency(item.high)}</Text>
        </Text>
        <Text>
          Baixa: <Text style={styles.baixa}>R${formatCurrency(item.low)}</Text>
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
              <SearchBar
                placeholder="Type Here..."
                onChangeText={undefined}
                value={undefined}
              />
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
        <Text>Carregando...</Text>
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
  alta: {
    color: "#FF4B4A",
    fontSize: 16,
    fontWeight: "bold",
  },
  baixa: {
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
