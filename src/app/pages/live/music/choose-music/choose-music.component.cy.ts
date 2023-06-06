import {ChooseMusicComponent} from './choose-music.component'

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Cypress test for choose-music component
 */
describe('ChooseMusicComponent', () => {
  it('should mount', () => {
    cy.mount(ChooseMusicComponent)
  })
})
