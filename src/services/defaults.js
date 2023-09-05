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
    sharingLevel: '3'
});

export { getDefaultExercise };