/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: Mai 2023
 * @description Suite of Cypress tests for the Dashboard component
 */
describe('DashboardComponent', () => {
  beforeEach(() => {
    cy.visit('/'); // Replace with the correct path to your DashboardComponent
    cy.fixture('dashboard').as('dashboardData');
  });

  /**
   * @description Verifies that the DashboardComponent is created.
   */
  it('should create', () => {
    cy.get('app-dashboard').should('exist');
  });

  /**
   * @description Verifies that the app-grid-cards component is rendered with correct inputs.
   */
  it('should render app-grid-cards component with correct inputs', function () {
    cy.get('app-grid-cards').within(() => {
      cy.get('[data-cy=icon]').each(($icon, index) => {
        cy.wrap($icon).should(
          'have.attr',
          'src',
          this['dashboardData'].icons[index]
        );
      });

      cy.get('[data-cy=matCardContentParagraph]').each(($paragraph, index) => {
        cy.wrap($paragraph).should(
          'have.text',
          this['dashboardData'].titles[index + 1]
        );
      });

      cy.get('mat-card').then(($cards) => {
        const cardCount = $cards.length;

        for (let i = 0; i < cardCount; i++) {
          cy.get('mat-card').eq(i).click();
          cy.url().should('include', this['dashboardData'].routerLinks[i]);
          cy.visit('/');
        }
      });
    });
  });
});
