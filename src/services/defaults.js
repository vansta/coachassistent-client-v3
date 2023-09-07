const getDefaultExercise = (userId) => ({
    id: '',
    name: '',
    description: '',
    edit: true,
    dialog: true,
    attachments: [],
    editorIds: [userId],
    constructor: { modelName: 'shareable' },
    tags: [],
    sharingLevel: '3',
    level: 0
});

const levels = ['0', '1', '2', '3', '4'].map(l => ({ title: l, value: l }))

export { getDefaultExercise, levels };