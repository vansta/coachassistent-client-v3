<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-stage ref="stage" :config="configKonva" @mousedown="handleStageMouseDown">
                        <v-layer ref="layer">
                            <v-transformer ref="transformer"></v-transformer>
                        </v-layer>
                    </v-stage>
                </v-card>
            </v-col>
            <v-col>
                <v-row>
                    <v-col>
                        <v-btn-toggle v-model="options.action" mandatory @update:model-value="clearCurrentLine">
                            <v-btn icon="mdi-draw" value="draw"></v-btn>
                            <v-btn icon="mdi-shape-plus" value="shape"></v-btn>
                            <v-btn icon="mdi-cursor-move" value="transform"></v-btn>
                            <v-btn icon="mdi-delete" value="delete"></v-btn>
                            <v-btn icon="mdi-format-color-fill" value="fill"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
                <v-row v-if="options.action === 'draw'">
                    <v-col>
                        <v-btn-toggle v-model="options.lineType" mandatory @update:model-value="clearCurrentLine">
                            <v-btn icon="mdi-vector-polyline" value="vector"></v-btn>
                            <v-btn icon="mdi-arrow-top-right-thin" value="arrow"></v-btn>
                            <v-btn icon="mdi-vector-polygon" value="polygon"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
                <v-row v-else-if="options.action === 'shape'">
                    <v-col>
                        <v-btn-toggle v-model="options.shapeType" mandatory>
                            <v-btn icon="mdi-square" value="rect"></v-btn>
                            <v-btn icon="mdi-circle" value="circle"></v-btn>
                            <v-btn icon="mdi-ellipse" value="ellipse"></v-btn>
                            <v-btn icon="mdi-arrow-top-right-thin" value="arrow"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
                <v-row>
                        <v-col cols="1">
                            <v-icon>mdi-palette</v-icon>
                        </v-col>
                        <v-col>
                            <v-menu :close-on-content-click="false">
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    icon="mdi-square"
                                    
                                    v-bind="props"
                                    >
                                        <v-icon :color="options.fillColor">mdi-square</v-icon>
                                    </v-btn>
                                </template>
                                <v-color-picker v-model="options.fillColor" hide-inputs></v-color-picker>
                            </v-menu>

                            <v-menu :close-on-content-click="false">
                                <template v-slot:activator="{ props }">
                                    <v-btn
                                    icon="mdi-square-outline"
                                    
                                    v-bind="props"
                                    
                                    >
                                        <v-icon :color="options.color">mdi-square-outline</v-icon>
                                    </v-btn>
                                </template>
                                <v-color-picker v-model="options.color" hide-inputs></v-color-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
            </v-col>
        </v-row>
    </v-container>
    
</template>

<script setup>
import { ref } from 'vue';
import Konva from 'konva';
const stage = ref(null);
const layer = ref(null);
const transformer = ref(null);
const configKonva = ref({
        width: 400,
        height: 400
      });
const options = ref({
    action: 'draw',
    shapeType: 'rect',
    lineType: 'vector',
    fillShape: false,
    eraser: false,
    color: '#000000',
    fillColor: '#000000',
    lineWidth: 5,
    lineCap: 'round',
    lineJoin: 'miter',
    backgroundColor: '#FFFFFF'
});

const currentLine = ref(null);

const addShape = (x, y) => {
    console.log(options.value.shapeType);

    var config = {
        fill: options.value.fillColor,
        stroke: options.value.color,
        strokeWidth: options.value.lineWidth,
        draggable: true
    }

    var shape;
    switch (options.value.shapeType) {
        case 'rect':
            config.x = x;
            config.y = y;
            config.width = 50;
            config.height = 50;
            shape = new Konva.Rect(config);
            break;
        case 'circle':
            config.x = x;
            config.y = y;
            config.radius = 80;
            shape = new Konva.Circle(config);
            break;
        case 'ellipse':
            config.x = x;
            config.y = y;
            config.radiusX = 80;
            config.radiusY = 40;
            shape = new Konva.Ellipse(config);
            break;
        default:
            break;
    }
    if (shape) {
        layer.value.getNode().add(shape);
    }
    
    layer.value.getNode().draw();
}

const addLine = (x, y) => {

    if (currentLine.value) {
        currentLine.value.attrs.points.push(x, y);
    }
    else {
        var line;
        var config = {
            fill: options.value.fillColor,
            stroke: options.value.color,
            strokeWidth: options.value.lineWidth,
            draggable: true,
            points: [x, y],
            lineCap: 'round',
            lineJoin: 'round'
        };
        switch (options.value.lineType) {
            case 'arrow':
                line = new Konva.Arrow(config);
                break;
            case 'polygon':
                config.closed = true;
                line = new Konva.Line(config);
                break;
            default:
                line = new Konva.Line(config);
                break;
        }
        currentLine.value = line;
        layer.value.getNode().add(line);
    }
    layer.value.getNode().draw();
}

const handleStageMouseDown = (e) => {
    console.log(e);

    if (options.value.action === 'draw'){
        // if (e.target !== e.target.getStage() && !currentLine.value) {
        //     currentLine.value = e.target;
        // }

        const mousePos = stage.value.getNode().getPointerPosition();
        addLine(mousePos.x, mousePos.y);
    }
    else if (options.value.action === 'shape'){
        const mousePos = stage.value.getNode().getPointerPosition();
        addShape(mousePos.x, mousePos.y);
    }
    else if (options.value.action === 'transform') {
        // clicked on stage - clear selection
        if (e.target === e.target.getStage()) {
            transformer.value.getNode().nodes([]);
            return;
        }

        // clicked on transformer - do nothing
        const clickedOnTransformer =
            e.target.getParent().className === 'Transformer';
            if (clickedOnTransformer) {
                return;
            }

        transformer.value.getNode().nodes([e.target]);
    }
    else if (options.value.action === 'delete') {
        if (e.target === e.target.getStage()) {
            return;
        }
        e.target.remove();
    }
    else if (options.value.action === 'fill') {
        if (e.target === e.target.getStage()) {
            return;
        }
        e.target.fill(options.value.fillColor);
    }
}

const clearCurrentLine = () => {
    currentLine.value = null;
}

</script>