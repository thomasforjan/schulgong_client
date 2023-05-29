import {MusicComponent} from './music.component'

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Cypress test for music component
 */
describe('MusicComponent', () => {
  it('should mount', () => {
    cy.mount(MusicComponent)
  })
})
