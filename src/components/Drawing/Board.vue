<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <vue-drawing-canvas 
                        ref="canvas"
                        v-bind="options"></vue-drawing-canvas>
                </v-card>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        <v-btn-toggle v-model="options.strokeType">
                            <v-btn icon="mdi-draw-pen" value="dash"></v-btn>
                            <v-btn icon="mdi-vector-line" value="line"></v-btn>
                            <v-btn icon="mdi-square-outline" value="square"></v-btn>
                            <v-btn icon="mdi-circle-outline" value="circle"></v-btn>
                            <v-btn icon="mdi-triangle-outline" value="triangle"></v-btn>
                            <v-btn icon="mdi-square-outline" value="half_triangle"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-switch v-model="options.fillShape" prepend-icon="mdi-format-color-fill"></v-switch>
                    </v-col>
                    <v-col>
                        
                        <v-switch v-model="options.eraser" prepend-icon="mdi-eraser"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-menu :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                icon="mdi-palette"
                                v-bind="props"
                                variant="text"
                                >
                                </v-btn>
                            </template>
                            <v-color-picker v-model="options.color" hide-inputs></v-color-picker>
                        </v-menu>

                        <v-menu :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                                <v-btn
                                icon="mdi-format-color-fill"
                                v-bind="props"
                                variant="text"
                                >
                                </v-btn>
                            </template>
                            <v-color-picker v-model="options.backgroundColor" hide-inputs></v-color-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-slider v-model="options.lineWidth" prepend-icon="mdi-pencil-ruler-outline"></v-slider>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn-toggle v-model="options.lineCap">
                            <v-btn icon="mdi-circle" value="round"></v-btn>
                            <v-btn icon="mdi-square-medium" value="square"></v-btn>
                            <v-btn icon="mdi-square" value="butt"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
                <!-- <v-row>
                    <v-col>
                        <v-btn-toggle v-model="options.lineJoin">
                            <v-btn icon="mdi-eraser" value="miter"></v-btn>
                            <v-btn icon="mdi-vector-line" value="round"></v-btn>
                            <v-btn icon="mdi-vector-line" value="bevel"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row> -->
                <v-row>
                    <v-col>
                        <v-btn-toggle>
                            <v-btn icon="mdi-delete" @click="onReset"></v-btn>
                            <v-btn icon="mdi-undo" @click="onUndo"></v-btn>
                            <v-btn icon="mdi-redo" @click="onRedo"></v-btn>
                            <v-btn icon="mdi-refresh" @click="onRedraw"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
    
</template>

<script setup>
import VueDrawingCanvas from 'vue-drawing-canvas';
import { ref } from 'vue';
const options = ref({
    strokeType: 'dash',
    fillShape: false,
    eraser: false,
    color: '#000000',
    lineWidth: 5,
    lineCap: 'round',
    lineJoin: 'miter',
    backgroundColor: '#FFFFFF',
    watermark: {
            type: "Text",
            source: "Coach /n Assistent",

            x: 100,
            y: 100,
            imageStyle: {
                width: 600,
                height: 400
            },
            fontStyle: {
                width: 200,
                lineHeight: 48,
                color: '#FF0000',
                font: 'bold 48px serif',
                drawType: 'fill',
                textAlign: 'left',
                textBaseline: 'top',
                rotate: 0
            }
    },
    // additionalImages: [
    //     {
    //         type: "Text",
    //         source: "Watermark",

    //         x: 200,
    //         y: 180,
    //         imageStyle: {
    //             width: 600,
    //             height: 400
    //         },
    //         fontStyle: {
    //             width: 200,
    //             lineHeight: 48,
    //             color: '#FF0000',
    //             font: 'bold 48px serif',
    //             drawType: 'fill',
    //             textAlign: 'left',
    //             textBaseline: 'top',
    //             rotate: 45
    //         }
    //     },
    //     {
    //         type: "Text",
    //         source: "Watermark",

    //         x: 200,
    //         y: 280,
    //         imageStyle: {
    //             width: 600,
    //             height: 400
    //         },
    //         fontStyle: {
    //             width: 200,
    //             lineHeight: 48,
    //             color: '#FF0000',
    //             font: 'bold 48px serif',
    //             drawType: 'fill',
    //             textAlign: 'left',
    //             textBaseline: 'top',
    //             rotate: -45
    //         }
    //     }
    // ]
});
const canvas = ref(null);

const onReset = () => {
    canvas.value.reset();
}
const onUndo = () => {
    canvas.value.undo();
}
const onRedo = () => {
    canvas.value.redo();
}
const onRedraw = () => {
    canvas.value.redraw();
}
</script>