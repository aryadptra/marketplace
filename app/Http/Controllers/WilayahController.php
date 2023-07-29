<?php

namespace App\Http\Controllers;

use App\Models\IndonesiaCities;
use App\Models\IndonesiaDistricts;
use App\Models\IndonesiaProvince;
use App\Models\IndonesiaVillages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WilayahController extends Controller
{
    public function get()
    {
        // Get this data from url with curl  https://open-api.my.id/api/wilayah/provinces
        $url = 'https://open-api.my.id/api/wilayah/regencies/12';

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            // Error handling if cURL request fails
            $error_message = curl_error($ch);
            return response()->json(['error' => $error_message], 500);
        }

        curl_close($ch);

        // Process the response data as needed
        $data = json_decode($response, true);

        // Return the data as a JSON response
        return response()->json($data);
    }

    public function index()
    {
    }

    public function insertData()
    {
        set_time_limit(50000);

        $chunkSize = 20;
        $totalData = 7215;
        $totalChunks = ceil($totalData / $chunkSize);

        for ($i = 0; $i < $totalChunks; $i++) {
            $offset = $i * $chunkSize;
            $province = IndonesiaDistricts::orderBy('id', 'desc')->skip($offset)->take($chunkSize)->get();

            foreach ($province as $data) {
                $province_code = $data['code'];

                $url = 'https://open-api.my.id/api/wilayah/villages/' . $province_code;

                $response = Http::timeout(50000)->get($url);

                // Check if the HTTP request is successful
                if ($response->successful()) {
                    $data = $response->json();

                    if (!empty($data)) {
                        foreach ($data as $cities) {
                            IndonesiaVillages::updateOrCreate(
                                [
                                    'code' => $cities['id'],
                                    'district_code' => $cities['district_id'],
                                ],
                                [
                                    'name' => $cities['name'],
                                    // Add other columns as needed and map them to the corresponding keys in the $cities array
                                ]
                            );
                        }
                    }
                } else {
                    // Error handling if the HTTP request fails
                    $error_message = $response->status() . ' ' . $response->body();
                    return response()->json(['error' => $error_message], 500);
                }
            }
        }

        // Return a response indicating success or failure
        return response()->json(['message' => 'Data inserted successfully']);
    }
}
