<template>
    <v-container>
        <v-card>
            <v-card-title>
                Welkom bij Coach Assistent!
            </v-card-title>
            <v-card-text>
                <p>Links vind je een databank van oefeningen, onderdelen en trainingen. Log in om je eigen oefeningen toe te voegen en te delen.</p>
                <br>
                <p>Bij het inloggen kan je vragen om een bestaande groep te vervoegen, of een nieuwe groep aan te maken.
                <br> Binnen deze groep kan je jouw ideëen uitwisselen.</p>
                <br>
                <p>Alles wat je aanmaakt, kan je delen op verschillende niveaus. Hou ze enkel voor jezelf bij, deel ze met je groep, of laat iedereen genieten van jouw inspiratie.</p>
                <br>
                <p>Deze site is nog volop in ontwikkeling, dus geef je zeker ideëen, opmerkingen en problemen door via <a href="mailto: stan.vancraeynest@gmail.com">stan.vancraeynest@gmail.com</a>.</p>
                <br>
                <p>Welkom, en bedankt!</p>
            </v-card-text>
            <v-card-actions>
                <v-btn :to="{ name: 'Home' }" color="primary">Verdergaan</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { useI18n } from "vue-i18n";


const { t } = useI18n();
</script>