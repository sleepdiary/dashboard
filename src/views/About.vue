<template>
    <v-main
        style="padding-bottom:56px"
    >

        <div style="height:100%;max-width:600px;margin:auto" class="d-flex flex-column justify-center">

            <v-list>

                <v-subheader>About</v-subheader>

                <v-list-item
                    :href="project_url+'dashboard'"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-github</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Source code</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item
                    :href="project_url+'dashboard/LICENSE'"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-license</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>License</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item
                    :href="project_url+'dashboard/issues/new'"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-message</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Contact us</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list>

        </div>

    </v-main>
</template>

<script>

 import { PROJECT_URL, SITE_URL } from "@/constants.js";

 export default {
     name: 'Info',

     data: () => ({
         project_url: PROJECT_URL,
            site_url:    SITE_URL,
     }),

 }

</script>
