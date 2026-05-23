module.exports = {
  async getReleaseLine(changeset) {
    return changeset.summary;
  },

  async getDependencyReleaseLine() {
    return '';
  },
}
