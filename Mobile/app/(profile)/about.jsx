import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const About = () => {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="#078ECB" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>
        Bienvenue dans notre application de gestion financière !
      </Text>
      <Text style={styles.description}>
        Cette application a été conçue pour vous aider à mieux gérer vos finances personnelles.
        Dans un monde où les dépenses et les revenus sont en constante évolution,
        il est essentiel de garder un œil sur votre situation financière.
        Que vous souhaitiez suivre vos dépenses quotidiennes, gérer votre budget ou épargner pour un projet futur,
        notre application est là pour vous accompagner.
      </Text>

      <Text style={styles.subtitle}>Importance de l'Application</Text>
      <Text style={styles.description}>
        Aujourd'hui, la gestion financière est plus importante que jamais. Avec l'augmentation des coûts de la vie
        et l'incertitude économique, savoir où va votre argent est essentiel pour prendre des décisions éclairées.
        Cette application vous permet de :
      </Text>
      <Text style={styles.bulletPoint}>• Suivre vos transactions</Text>
      <Text style={styles.bulletPoint}>• Gérer vos budgets</Text>
      <Text style={styles.bulletPoint}>• Catégoriser vos dépenses</Text>
      <Text style={styles.bulletPoint}>• Recevoir des notifications</Text>

      <Text style={styles.subtitle}>À propos de moi</Text>
      <Text style={styles.description}>
        Je m'appelle Diagui TOUNKARA, développeur web et mobile fullstack.
        Passionné de technologie et de finance, j'ai créé cette application
        pour aider les gens à prendre le contrôle de leurs finances.
        Ayant moi-même rencontré des défis en matière de gestion financière,
        j'ai voulu développer un outil qui simplifie ce processus.
        Mon objectif est de fournir une solution accessible et efficace
        pour que chacun puisse gérer ses finances avec confiance.
      </Text>

      <Text style={styles.description}>
        Merci de faire partie de cette aventure ! J'espère que cette application
        vous sera utile et vous aidera à atteindre vos objectifs financiers.
      </Text>

      <Text style={styles.subtitle}>Contact</Text>
      <Text style={styles.description}>
        Si vous avez des questions, des commentaires ou des suggestions,
        n'hésitez pas à me contacter à{" "}
        <Text style={styles.email}>tounkaradiagui@gmail.com</Text>.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#078ECB",
    fontSize: 16,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#222",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
    color: "#444",
  },
  bulletPoint: {
    fontSize: 16,
    marginTop: 6,
    marginLeft: 12,
    lineHeight: 22,
    color: "#444",
  },
  email: {
    color: "#078ECB",
    fontWeight: "bold",
  },
});

export default About;
