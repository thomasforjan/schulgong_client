describe('Klingelzeit Test', () => {
  it('Visit the ringtime page', () => {
    cy.visit('http://localhost:4200/ringtime');

    // Testing titles of the dashboard
    cy.contains('Schulgong');
    cy.contains('Klingelzeit');

    cy.get(`[aria-label="addRingtime"]`)
      .children(`[aria-label="ariaLabelText"]`)
      .click();

    //  Check if all elements exists
    cy.contains('Klingelzeit - Hinzufügen');
    cy.get(`[aria-label="ringtimeName"]`);
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
    cy.get(`[aria-label="ringtimeName"]`).type('Beginn 2.Stunde');

    //  Verify that the value has been updated
    cy.get(`[aria-label="ringtimeName"]`)
      .find('input')
      .should('have.value', 'Beginn 2.Stunde');

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
  });
});
