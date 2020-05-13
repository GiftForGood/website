import AuthAPI from './auth';
import CategoriesAPI from './categories';
import DonationsAPI from './donations';
import NPOOrganizationAPI from './npoOrganizations';
import ReportsAPI from './reports';
import ReviewsAPI from './reviews';
import UsersAPI from './users';
import WishesAPI from './wishes';

class API {
  auth = new AuthAPI();
  categories = new CategoriesAPI();
  donations = new DonationsAPI();
  npoOrganization = new NPOOrganizationAPI();
  reports = new ReportsAPI();
  reviews = new ReviewsAPI();
  users = new UsersAPI();
  wishes = new WishesAPI();
}

const api = new API();

export default api;
