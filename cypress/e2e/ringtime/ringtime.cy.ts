describe('Klingelzeit Test', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('dashboard').as('dashboardData');

    // Enter password
    cy.get('[data-cy=input-password]').type('Schulgong').type('{enter}'); // '{enter}' submits the form

    // Press login button
    cy.get('[data-cy=login-button]').click();
    cy.wait(3000);
  });

  it('Visit the ringtime page', () => {
    cy.visit('/ringtime');

    // Testing titles of the dashboard
    cy.contains('Schulgong');
    cy.contains('Klingelzeit');

    cy.get(`[aria-label="addRingtime"]`)
      .children(`[aria-label="ariaLabelText"]`)
      .click();

    //  Check if all elements exists
    cy.contains('Klingelzeit hinzufügen');
    cy.get(`[aria-label="Klingelzeitbezeichnung"]`);
    cy.get(`[aria-label="ringtimeStartdate"]`);
    cy.get(`[aria-label="ringtimeEnddate"]`);
    cy.contains('MO');
    cy.get(`[aria-label="ringtimeCheckboxMonday"]`);
    cy.contains('DI');
    cy.get(`[aria-label="ringtimeCheckboxTuesday"]`);
    cy.contains('MI');
    cy.get(`[aria-label="ringtimeCheckboxWednesday"]`);
    cy.contains('DO');
    cy.get(`[aria-label="ringtimeCheckboxThursday"]`);
    cy.contains('FR');
    cy.get(`[aria-label="ringtimeCheckboxFriday"]`);
    cy.contains('SA');
    cy.get(`[aria-label="ringtimeCheckboxSaturday"]`);
    cy.contains('SO');
    cy.get(`[aria-label="ringtimeCheckboxSunday"]`);
    cy.get(`[aria-label="ringtimePlaytime"]`);
    cy.get(`[aria-label="ringtimeRingtone"]`);
    cy.get(`[aria-label="ringtimeSaveButton"]`).children(
      `[aria-label="ariaLabelText"]`
    );
    cy.get(`[aria-label="ringtimeCancelButton"]`).children(
      `[aria-label="ariaLabelText"]`
    );

    //  Get an input, type into it
    cy.get(`[aria-label="Klingelzeitbezeichnung"]`).type(
      'Cypress Ringtime Test'
    );

    //  Verify that the value has been updated
    cy.get(`[aria-label="Klingelzeitbezeichnung"]`)
      .find('input')
      .should('have.value', 'Cypress Ringtime Test');

    //  Get an input, type into it
    cy.get(`[aria-label="ringtimeStartdate"]`).type('2022-09-01');
    //  Verify that the value has been updated
    cy.get(`[aria-label="ringtimeStartdate"]`)
      .find('input')
      .should('have.value', '2022-09-01');

    //  Get an input, type into it
    cy.get(`[aria-label="ringtimeEnddate"]`).type('2023-07-30');
    //  Verify that the value has been updated
    cy.get(`[aria-label="ringtimeEnddate"]`)
      .find('input')
      .should('have.value', '2023-07-30');

    cy.get(`[aria-label="ringtimeCheckboxMonday"]`).click();
    cy.get(`[aria-label="ringtimeCheckboxTuesday"]`).click();
    cy.get(`[aria-label="ringtimeCheckboxWednesday"]`).click();
    cy.get(`[aria-label="ringtimeCheckboxThursday"]`).click();
    cy.get(`[aria-label="ringtimeCheckboxFriday"]`).click();
    cy.get(`[aria-label="ringtimeCheckboxSaturday"]`).click();
    cy.get(`[aria-label="ringtimeCheckboxSunday"]`).click();

    // Get an input, type into it
    cy.get(`[aria-label="ringtimePlaytime"]`).type('08:00');
    //  Verify that the value has been updated
    cy.get(`[aria-label="ringtimePlaytime"]`)
      .find('input')
      .should('have.value', '08:00');

    // Select ringtone from dropdown
    cy.get(`[aria-label="ringtimeRingtone"]`).click();
    cy.get('mat-option').contains('Alarm').click();

    // Save the ringtime
    cy.get(`[aria-label="ringtimeSaveButton"]`).click();
  });
});
