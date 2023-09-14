<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                
                <v-card :height="stageWidth" :width="stageWidth">
                    <v-stage ref="stage" :config="configKonva" @mousedown="handleStageMouseDown" style="border: 15px solid black;">
                        <v-layer ref="layer">
                            <v-transformer ref="transformer"></v-transformer>
                        </v-layer>
                    </v-stage>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card :width="stageWidth">
                    <v-card-title>
                        <v-btn-toggle v-model="options.action" mandatory @update:model-value="clearCurrentLine" variant="outlined" divided>
                            <v-btn icon="mdi-draw" value="draw">
                                <v-icon>mdi-draw</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.draw')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-shape-plus" value="shape">
                                <v-icon>mdi-shape-plus</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.shape')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-cursor-move" value="transform">
                                <v-icon>mdi-cursor-move</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.transform')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-form-textbox" value="text">
                                <v-icon>mdi-form-textbox</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.text')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-format-color-fill" value="fill">
                                <v-icon>mdi-format-color-fill</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.fill')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-delete" value="delete">
                                <v-icon>mdi-delete</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.delete')"></v-tooltip>
                            </v-btn>
                        </v-btn-toggle>
                    </v-card-title>
                    <v-card-text v-if="options.action === 'draw'">
                        <v-btn-toggle v-model="options.lineType" mandatory @update:model-value="clearCurrentLine" variant="outlined" divided>
                            <v-btn icon="mdi-vector-polyline" value="vector">
                                <v-icon>mdi-vector-polyline</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.vector')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-arrow-top-right-thin" value="arrow">
                                <v-icon>mdi-arrow-top-right-thin</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.arrow')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-vector-polygon" value="polygon">
                                <v-icon>mdi-vector-polygon</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.polygon')"></v-tooltip>
                            </v-btn>
                        </v-btn-toggle>
                    </v-card-text>
                    <v-card-text v-else-if="options.action === 'shape'">
                        <v-btn-toggle v-model="options.shapeType" mandatory variant="outlined" divided>
                            <v-btn icon="mdi-square" value="rect">
                                <v-icon>mdi-square</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.rect')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-circle" value="circle">
                                <v-icon>mdi-circle</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.circle')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-ellipse" value="ellipse">
                                <v-icon>mdi-ellipse</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.ellipse')"></v-tooltip>
                            </v-btn>
                        </v-btn-toggle>
                    </v-card-text>
                    <v-card-text v-else-if="options.action === 'transform'">
                        <v-btn-group variant="outlined" divided>
                            <v-btn icon="mdi-arrange-bring-forward" @click="moveUp">
                                <v-icon>mdi-arrange-bring-forward</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.bring_forward')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-arrange-send-backward" @click="moveDown">
                                <v-icon>mdi-arrange-send-backward</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.send_backward')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-arrange-bring-to-front" @click="moveToTop">
                                <v-icon>mdi-arrange-bring-to-front</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.bring_front')"></v-tooltip>
                            </v-btn>
                            <v-btn icon="mdi-arrange-send-to-back" @click="moveToBottom">
                                <v-icon>mdi-arrange-send-to-back</v-icon>
                                <v-tooltip activator="parent" location="bottom" :text="t('konva.send_back')"></v-tooltip>
                            </v-btn>
                        </v-btn-group>
                    </v-card-text>
                    <v-card-text v-else-if="options.action === 'text'">
                        <v-row>
                            <v-col cols="12">
                                <v-textarea v-model="textOptions.text" @update:model-value="redrawText" :label="t('konva.text')" auto-grow rows="2"></v-textarea>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="textOptions.fontSize" type="number" @update:model-value="redrawText" :label="t('konva.fontSize')"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-btn-toggle v-model="textOptions.align" mandatory @update:model-value="redrawText" variant="outlined" divided>
                                    <v-btn icon="mdi-format-align-left" value="left"></v-btn>
                                    <v-btn icon="mdi-format-align-center" value="center"></v-btn>
                                    <v-btn icon="mdi-format-align-right" value="right"></v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="12">
                                <v-btn-toggle v-model="textOptions.fontStyle" mandatory @update:model-value="redrawText" variant="outlined" divided>
                                    <v-btn icon="mdi-format-text" value="normal"></v-btn>
                                    <v-btn icon="mdi-format-bold" value="bold"></v-btn>
                                    <v-btn icon="mdi-format-italic" value="italic"></v-btn>
                                </v-btn-toggle>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-text v-else>
                        
                    </v-card-text>

                    <v-card-text>
                        <v-icon start>mdi-palette</v-icon>
                        <v-btn-group variant="outlined" divided>
                            <v-menu :close-on-content-click="false">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-square" v-bind="props">
                                        <v-icon :color="options.fillColor">mdi-square</v-icon>
                                        <v-tooltip activator="parent" location="bottom" :text="t('konva.fill')"></v-tooltip>
                                    </v-btn>
                                </template>
                                <v-color-picker v-model="options.fillColor" hide-inputs show-swatches :swatches="swatches"></v-color-picker>
                            </v-menu>

                            <v-menu :close-on-content-click="false">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-square-outline" v-bind="props">
                                        <v-icon :color="options.color">mdi-square-outline</v-icon>
                                        <v-tooltip activator="parent" location="bottom" :text="t('konva.stroke')"></v-tooltip>
                                    </v-btn>
                                </template>
                                <v-color-picker v-model="options.color" hide-inputs show-swatches :swatches="swatches"></v-color-picker>
                            </v-menu>
                        </v-btn-group>
                        <!-- <v-icon>mdi-palette</v-icon> -->
                        
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="save">
                            <v-icon start>mdi-content-save</v-icon>
                            {{ t('save') }}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="emit('close')">
                            <v-icon start>mdi-cancel</v-icon>
                            {{ t('close') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    
</template>

<script setup>
import { ref, computed } from 'vue';
import Konva from 'konva';
import { useI18n } from 'vue-i18n';
import { useWindowSize } from '@vueuse/core';
import { useDisplay } from 'vuetify';

const { t } = useI18n();
const { width, height } = useWindowSize();
const { mdAndUp } = useDisplay();
const stageWidth = computed(() => mdAndUp.value ? 590 : width.value - 30);

const emit = defineEmits(['save', 'close']);

const stage = ref(null);
const layer = ref(null);
const transformer = ref(null);
const configKonva = ref({
        width: stageWidth.value,
        height: stageWidth.value,
        offsetX: 5,
        offsetY: 5
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
const currentText = ref();
const textOptions = ref({
    fontSize: 18,
    text: null,
    align: 'left',
    fontStyle: 'normal'
});
const swatches = ref([
    ['#000000'],
    ['#FFFFFF'],
    ['#FF0000'],
    ['#00FF00'],
    ['#0000FF'],
])

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

const addText = (x, y) => {
    var textElement = new Konva.Text({
        x,
        y,
        text: textOptions.value.text,
        fontSize: textOptions.value.fontSize,
        fontFamily: 'Calibri',
        fill: options.value.fillColor,
        align: textOptions.value.align,
        draggable: true,
        fontStyle: textOptions.value.fontStyle
      });

    layer.value.getNode().add(textElement);
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
    else if (options.value.action === 'text'){
        if (e.target.className === 'Text'){
            // transformer.value.getNode().nodes([e.target]);
            currentText.value = e.target;
            textOptions.value = Object.assign({}, e.target.attrs);
        }
        else if (textOptions.value.text) {
            const mousePos = stage.value.getNode().getPointerPosition();
            addText(mousePos.x, mousePos.y);
        }
        
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
        e.target.stroke(options.value.color);
    }
}

const clearCurrentLine = () => {
    currentLine.value = null;
    transformer.value.getNode().nodes([]);
}

const redrawText = () => {
    if (currentText.value) {
        textOptions.value.fontSize = parseInt(textOptions.value.fontSize);
        currentText.value.setAttrs(textOptions.value);
    }
}

const moveUp = () => {
    transformer.value.getNode().nodes().forEach(n => n.moveUp());
}
const moveDown = () => {
    transformer.value.getNode().nodes().forEach(n => n.moveDown());
}
const moveToTop = () => {
    transformer.value.getNode().nodes().forEach(n => n.moveToTop());
}
const moveToBottom = () => {
    transformer.value.getNode().nodes().forEach(n => n.moveToBottom());
}

const save = () => {
    var uri = stage.value.getNode().toDataURL();
    // var uri = stage.value.getNode().toImage();
    emit('save', uri);
}

</script>