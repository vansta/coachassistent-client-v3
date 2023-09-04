const getDefaultExercise = (userId) => ({
    id: '',
    name: '',
    description: '',
    edit: true,
    dialog: true,
    attachments: [],
    editorIds: [userId],
    constructor: { modelName: 'shareable' }
});

export { getDefaultExercise };