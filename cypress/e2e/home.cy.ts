describe('TopicSection', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for the Response of API
    cy.wait(3500)
  })

  it('should toggle the isSelected property of a repository when the toggle button is clicked', () => {
    cy.get('.shrink-0.relative').first().as('repo')

    cy.get('@repo').find('button').click()

    cy.get('@repo').should('have.class', 'bg-gray-300')

    cy.get('@repo').find('img').should('have.attr', 'alt', 'Selected')

    cy.get('@repo').find('button').click()

    cy.get('@repo').should('have.class', 'bg-gray-300')

    cy.get('@repo').find('img').should('have.attr', 'alt', 'Not selected')
  })

  it('should update the selectedRepositories array when a topic button is clicked', () => {
    cy.get('.flex-wrap > :nth-child(2)').click()

    cy.get('.shrink-0.relative').should('have.length.greaterThan', 0)
  })

  it('should sort the repositories correctly when a sort option is selected', () => {
    cy.get('#sort-by').select('forks')

    cy.get('#sort-by').first().should('contain', 'Forks')
  })

  it('should update the selectedRepositories array when a topic button is clicked', () => {
    cy.get('.flex-wrap > :nth-child(2)').click()

    cy.get('#sort-by').select('forks')

    cy.get('#sort-by').first().should('contain', 'Forks')
  })

  it('adds a repository to the starred list when selected', () => {
    cy.get('.flex .shrink-0').first().click()

    cy.get('.flex .shrink-0').first().should('have.class', 'bg-gray-300')

    cy.get('.flex .shrink-0').first().find('button').click()

    cy.get('.flex .shrink-0')
      .first()
      .find('img')
      .should('have.attr', 'src', '/src/assets/svg/selected-star.svg')
  })

  it('removes a repository from the starred list when deselected', () => {
    cy.get('.flex .shrink-0').first().click()

    cy.get('.flex .shrink-0').first().should('have.class', 'bg-gray-300')

    cy.get('.flex .shrink-0').first().find('button').click()

    cy.get('.flex .shrink-0')
      .first()
      .find('img')
      .should('have.attr', 'src', '/src/assets/svg/selected-star.svg')

    cy.get('.flex .shrink-0').first().find('button').click()

    cy.get('.flex .shrink-0').first().find
  })
})
