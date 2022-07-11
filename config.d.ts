/*
 * Copyright 2022 Okay, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface Config {
    okay: {
        /**
         * Configuration for iframing dashboards
         * @visibility backend
         */
         iframe: {
            /**
             * Secret to sign requests for iframing
             * @visibility secret
             */
            secret: string;
            
            /**
             * Id to send with requests for iframing
             */
            id: string;

            /**
             * Domain to make iframe requests to, default is https://app.okayhq.com
             */
            domain?: string;
        }
    }
}