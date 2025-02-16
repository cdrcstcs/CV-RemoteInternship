/* eslint-disable no-prototype-builtins */
import { clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

// Utility to merge class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString) => {
  const dateTimeOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime = new Date(dateString).toLocaleString("en-US", dateTimeOptions);
  const formattedDateDay = new Date(dateString).toLocaleString("en-US", dateDayOptions);
  const formattedDate = new Date(dateString).toLocaleString("en-US", dateOptions);
  const formattedTime = new Date(dateString).toLocaleString("en-US", timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Format amount as USD currency
export function formatAmount(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

// Parse and stringify JSON safely
export const parseStringify = (value) => JSON.parse(JSON.stringify(value));

// Remove special characters from a string
export const removeSpecialCharacters = (value) => {
  return value.replace(/[^\w\s]/gi, "");
};

// Form URL query string with updated parameters
export function formUrlQuery({ params, key, value }) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// Get colors based on account type
export function getAccountTypeColors(type) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

// Count categories of transactions
export function countTransactionCategories(transactions) {
  const categoryCounts = {};
  let totalCount = 0;

  transactions &&
    transactions.forEach((transaction) => {
      const category = transaction.category;

      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }

      totalCount++;
    });

  const aggregatedCategories = Object.keys(categoryCounts).map((category) => ({
    name: category,
    count: categoryCounts[category],
    totalCount,
  }));

  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

// Extract customer ID from a URL string
export function extractCustomerIdFromUrl(url) {
  const parts = url.split("/");
  const customerId = parts[parts.length - 1];

  return customerId;
}

// Encrypt ID to base64
export function encryptId(id) {
  return btoa(id);
}

// Decrypt ID from base64
export function decryptId(id) {
  return atob(id);
}

// Get transaction status based on date
export const getTransactionStatus = (date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

// Authentication form schema based on type (sign-in or sign-up)
export const authFormSchema = (type) => {
  return {
    firstName: type === 'sign-in' ? undefined : { type: 'string', minLength: 3 },
    lastName: type === 'sign-in' ? undefined : { type: 'string', minLength: 3 },
    address1: type === 'sign-in' ? undefined : { type: 'string', maxLength: 50 },
    city: type === 'sign-in' ? undefined : { type: 'string', maxLength: 50 },
    state: type === 'sign-in' ? undefined : { type: 'string', minLength: 2, maxLength: 2 },
    postalCode: type === 'sign-in' ? undefined : { type: 'string', minLength: 3, maxLength: 6 },
    dateOfBirth: type === 'sign-in' ? undefined : { type: 'string', minLength: 3 },
    ssn: type === 'sign-in' ? undefined : { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8 },
  };
};
