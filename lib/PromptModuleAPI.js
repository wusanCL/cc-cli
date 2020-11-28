module.exports = class PromptModuleAPI {
    constructor(creator) {
        this.creator = creator
    }

    injectFeature(feature) {
        this.creator.featurePrompts.choices.push(feature)
    }

    injectPrompt(prompt) {
        this.creator.injectedPrompts.push(prompt)
    }

    onPromptComplete(cb) {
        this.creator.promptCompleteCbs.push(cb)
    }
}
