import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom"
import { mockUseUserAccount, __set_roles } from '../__mocks__/UserAccount';
import { RBACProtectedComponent } from '../protected-component';

jest.mock('../UserAccount', () => ({ useUserAccount: mockUseUserAccount }))

// --------------------
// Test fixture
// --------------------

const UNAUTHORIZED = "UNAUTHORIZED"
const UNAUTHENTICATED = "UNAUTHENTICATED"
const LOADING = "LOADING"
const SOME_ROLE = "SOME_ROLE"
const PROTECTED = "PROTECTED"


const Fixture = () => {
  return (
    <RBACProtectedComponent
      unauthorized={UNAUTHORIZED}
      unauthenticated={UNAUTHENTICATED}
      loading={LOADING}
      allowedRoles={[SOME_ROLE]}
      content={PROTECTED}
    />
  )
}


describe("Protected Routes", () => {

  describe("User has correct Role", () => {

    it(`should render the the protected route`, () => {
      __set_roles(["SOME_ROLE"])
      render(<Fixture />);
      const protectedContent = screen.findByTestId(PROTECTED);
      expect(protectedContent).toBeInTheDocument()
    });
  })


  describe("User is logged in witouth permissoins", () => {

    it(`undefined roles`, () => {
      __set_roles(undefined)
      render(<Fixture />);
      const content = screen.findByTestId(UNAUTHORIZED);
      expect(content).toBeInTheDocument()
    });

    it(`No roles`, () => {
      __set_roles([])
      render(<Fixture />);
      const content = screen.findByTestId(UNAUTHORIZED);
      expect(content).toBeInTheDocument()
    });

    it(`wrong roles`, () => {
      __set_roles(["WRONG_ROLE"])
      render(<Fixture />);
      const content = screen.findByTestId(UNAUTHORIZED);
      expect(content).toBeInTheDocument()
    });

  })

})
