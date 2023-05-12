import { AddEditHolidaysComponent } from './add-edit-holidays.component'

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Cypress test for Add-edit-holidays
 */
describe('AddEditHolidaysComponent', () => {
  it('should mount', () => {
    cy.mount(AddEditHolidaysComponent)
  })
})
