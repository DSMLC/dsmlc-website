import React from "react";
import Link from "next/link";
import ApplicationSection from "../../components/templates/ApplicationTemplate";
import applicationData from "../../../public/data/page_data/contact_executive.json";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dsmlcParchment to-dsmlcWhite py-12 px-4 sm:px-6 lg:px-8 font-redHat">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-dsmlcDarkBlack sm:text-6xl md:text-7xl font-quicksand">
            Join Our Executive Team
          </h1>
        </div>
        <div className="bg-dsmlcWhite shadow-xl rounded-4xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <ApplicationSection {...applicationData} />
            <div className="flex justify-center">
              <Link
                href="https://forms.gle/1gf3dtyjecYHpUQaA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-dsmlcWhite bg-dsmlcDataOrange hover:bg-dsmlcTangerine focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dsmlcTangerine transition duration-150 ease-in-out"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-dsmlcWhite overflow-hidden shadow-lg rounded-3xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-dsmlcDataOrange"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-dsmlcBlack truncate font-redHat">
                      Data Analysis
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-dsmlcTangerine font-quicksand">
                        Learn and apply
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-dsmlcWhite overflow-hidden shadow-lg rounded-3xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-dsmlcDataOrange"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-dsmlcBlack truncate font-redHat">
                      Coding Workshops
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-dsmlcTangerine font-quicksand">
                        Hands-on experience
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-dsmlcWhite overflow-hidden shadow-lg rounded-3xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-dsmlcDataOrange"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-dsmlcBlack truncate font-redHat">
                      ML Projects
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-dsmlcTangerine font-quicksand">
                        Build your portfolio
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
