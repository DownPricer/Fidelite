# Graph Report - Cartefidelité  (2026-10-02)

## Corpus Check
- 679 files · ~4,795,792 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3827 nodes · 11758 edges · 181 communities (160 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c13bc557`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-labels.ts
- rbac.ts
- merchant-card-template-service.ts
- click/route.ts
- react
- vitest
- ref_next_navigation
- getSessionUser
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- requireMerchantAdmin
- merchant-billing.ts
- insight-period.ts
- cn
- ad-visual-workflow.ts
- clients/ui.tsx
- src/app/layout.tsx
- statistics/route.ts
- google-wallet.ts
- google-auth.ts
- env.ts
- customer-profile.ts
- api-guard.ts
- fiche.tsx
- SettingsPanel
- customer-reward-progress.ts
- create-super-admin.ts
- advantages-ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- fake-ad-db.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- profile-page.tsx
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- use-wallet-unlock-animation.ts
- loyaltyBalanceForMode
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- tarifs/page.tsx
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- ref_fs_promises
- wallet-home.tsx
- @prisma/client
- scripts
- facturation/ui.tsx
- platform-stats.ts
- AdDetailPage
- fife-life/merchant-detail.tsx
- ref_path
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- merchant-app-access.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- caisse-client-number.test.ts
- ref_node_fs
- lib/campaign-worker.ts
- generate-pwa-icons.mjs
- ads/[id]/confirm/route.ts
- stripe.ts
- getSuperAdminSessionUser
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- jsonError
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-loyalty-overview.ts
- MerchantCampaignFiche
- profile-shared.tsx
- loyalty-service.ts
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- prisma.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- signInWithGoogleProfile
- ad-confirm-route.test.ts
- card-deck.tsx
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- cards-index.tsx
- sponsored-hours-pricing.ts
- HourlySchedulePicker
- webhook/route.ts
- merchants-list.tsx
- next
- app/ui.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- super-admin-session.ts
- google-wallet-doctor.ts
- push-client.ts
- super-admin/campagnes/page.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- [kind]/route.ts
- api-merchant-statistics-route.test.ts
- events/route.ts
- CampagnesPanel
- employee-create.ts
- marketing-balance.test.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- customer-history.ts
- marketing-topup-route.test.ts
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- campaign-lifecycle.ts
- solde/ui.tsx
- landing-merchant-preview.tsx
- outils/ui.tsx
- caisse-scan-route.test.ts
- ad-detail.tsx
- ref_next_server
- fiche/[id]/page.tsx
- CreateMerchantWizard
- use-media-query.ts
- card-deck-interaction.test.ts
- sponsored-selection.ts
- SettingsPage
- verify-viewports.mjs
- campaign-audience.test.ts
- arret/route.ts
- app/statistiques/page.tsx
- landing-footer.tsx
- card-template-schema.ts
- campaign-quota.test.ts
- loyalty-cards-capture.mjs
- abonnements/page.tsx
- insight-permissions.test.ts
- wallet-desktop-capture.mjs
- isGoogleSignInEnabled
- audit/page.tsx

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 241 edges
2. `jsonOk()` - 207 edges
3. `requireMutatingRequest()` - 144 edges
4. `prisma` - 138 edges
5. `vitest` - 116 edges
6. `readJson()` - 107 edges
7. `react` - 105 edges
8. `clientIp()` - 102 edges
9. `userAgent()` - 98 edges
10. `@prisma/client` - 96 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `click()` --calls--> `GET()`  [EXTRACTED]
  tests/sponsored-placements.test.ts → src/app/api/customer/sponsored/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (181 total, 21 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.22
Nodes (16): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+8 more)

### Community 1 - "loyalty-labels.ts"
Cohesion: 0.15
Nodes (21): TargetBlock(), assertEarnProgramRules(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), employeeCookieName(), employeeTokenFromRequest() (+13 more)

### Community 2 - "rbac.ts"
Cohesion: 0.19
Nodes (12): CustomerDetailPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission(), StaffMembership (+4 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (64): GET(), LOYALTY_MODES, GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), normalizeCardTemplateForSlot(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS (+56 more)

### Community 4 - "click/route.ts"
Cohesion: 0.20
Nodes (9): GET(), GET(), computeAdLifecycleStatus(), isSafeAdUrl(), isWithinUtcIntervals(), UtcInterval, adEventCreate, adRequestFindUnique (+1 more)

### Community 5 - "react"
Cohesion: 0.04
Nodes (61): ref_next_link, react, recharts, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES (+53 more)

### Community 6 - "vitest"
Cohesion: 0.07
Nodes (57): vitest, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), ActiveMerchantLoyaltyContext, getActiveMerchantLoyaltyContextBySlug() (+49 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.23
Nodes (19): ref_next_navigation, CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage() (+11 more)

### Community 8 - "getSessionUser"
Cohesion: 0.14
Nodes (15): dynamic, MerchantProfilePage(), EmployeeLoginPage(), dynamic, NotificationsPage(), HomePage(), ProEntryPage(), JoinMerchantPage() (+7 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (21): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetView(), pct(), ProgressCircle(), Props (+13 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (49): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+41 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (38): PATCH(), DELETE(), POST(), createMerchantFullSchema, merchantDeleteSchema, merchantStatusActionSchema, reauthSchema, acceptInvitationSchema (+30 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (66): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+58 more)

### Community 14 - "jsonOk"
Cohesion: 0.11
Nodes (65): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+57 more)

### Community 15 - "requireMerchantAdmin"
Cohesion: 0.12
Nodes (34): EDITABLE_STATUSES, GET(), PATCH(), GET(), POST(), GET(), loadOwnedCampaign(), PATCH() (+26 more)

### Community 16 - "merchant-billing.ts"
Cohesion: 0.11
Nodes (28): GET(), attachReceipts(), CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices(), listMerchantTransactions() (+20 more)

### Community 17 - "insight-period.ts"
Cohesion: 0.20
Nodes (23): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+15 more)

### Community 18 - "cn"
Cohesion: 0.08
Nodes (27): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), DashboardLayout(), AppNav() (+19 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.10
Nodes (31): GET(), schema, GET(), GET(), PATCH(), GET(), AdDayStats, AdPlacementStats (+23 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.15
Nodes (15): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+7 more)

### Community 21 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 22 - "statistics/route.ts"
Cohesion: 0.27
Nodes (11): GET(), GET(), PERIOD_KEYS, requireMerchantStatsAccess(), InsightPeriodKey, resolvePeriod(), getFreeMerchantStats(), getHomeStats() (+3 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.07
Nodes (74): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), GET(), isGoogleWalletConfigured() (+66 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.20
Nodes (14): GET(), consumeGoogleCallback(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES, GoogleAuthIntent, GoogleCallbackResult, googleClient() (+6 more)

### Community 25 - "env.ts"
Cohesion: 0.08
Nodes (32): dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), isWebPushConfigured(), hostMatches() (+24 more)

### Community 26 - "customer-profile.ts"
Cohesion: 0.29
Nodes (13): GET(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, ensureCustomerPreferences(), getProfileUser(), serializePreferences() (+5 more)

### Community 27 - "api-guard.ts"
Cohesion: 0.09
Nodes (39): zod, POST(), schema, POST(), POST(), dynamic, logCustomerQr(), POST() (+31 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.19
Nodes (17): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), evaluateCustomerRewards() (+9 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.09
Nodes (29): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.06
Nodes (31): description, engines, node, name, prisma, seed, private, version (+23 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder, MAX_COMPARISON_METRICS (+23 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.09
Nodes (35): GET(), DELETE(), POST(), uploadSchema, GET(), uploadSchema, AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX (+27 more)

### Community 38 - "fake-ad-db.ts"
Cohesion: 0.17
Nodes (15): END, fake, h, previewCall(), START, applyUpdate(), createFakeAdDb(), hydrate() (+7 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (33): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+25 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (27): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+19 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "profile-page.tsx"
Cohesion: 0.20
Nodes (14): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), SheetAction(), HistoryFilter, ProfilePage() (+6 more)

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.07
Nodes (53): FinancesTab(), AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem() (+45 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.09
Nodes (34): ref_next_headers, GET(), CaisseAliasPage(), GET(), GET(), GET(), GET(), EmployeeHomePage() (+26 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (29): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+21 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "use-wallet-unlock-animation.ts"
Cohesion: 0.09
Nodes (41): WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility(), isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation() (+33 more)

### Community 49 - "loyaltyBalanceForMode"
Cohesion: 0.11
Nodes (37): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, resolveClientNumber() (+29 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (42): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+34 more)

### Community 52 - "ref_node_path"
Cohesion: 0.10
Nodes (13): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, OUT, merchantSlugs (+5 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "tarifs/page.tsx"
Cohesion: 0.20
Nodes (11): AppLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, PricingFaq(), QUESTIONS, formatEurosFromCents(), isMerchantPlanId() (+3 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (27): percentChange(), buildCohorts(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam() (+19 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): MobilePlacementPreview(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "ref_fs_promises"
Cohesion: 0.12
Nodes (13): ref_fs_promises, ref_sharp, OUT, shots, OUT, tiers, files, INPUT_DIR (+5 more)

### Community 60 - "wallet-home.tsx"
Cohesion: 0.07
Nodes (33): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedViewProps, CardsSheet(), DiscoverPage(), Merchant, ExpandableQrCode() (+25 more)

### Community 61 - "@prisma/client"
Cohesion: 0.08
Nodes (31): @prisma/client, cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+23 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "AdDetailPage"
Cohesion: 0.22
Nodes (12): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), api(), formatCents() (+4 more)

### Community 66 - "fife-life/merchant-detail.tsx"
Cohesion: 0.07
Nodes (31): ref_react_dom_server, AddToGoogleWalletButton(), CardEnlargedView(), isFifeLifeCard(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY (+23 more)

### Community 67 - "ref_path"
Cohesion: 0.08
Nodes (15): ref_fs, ref_path, ref_vitest_config, main(), outDir, shot(), outDir, main() (+7 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "merchant-app-access.ts"
Cohesion: 0.28
Nodes (11): CaissePage(), DashboardLayout(), MerchantHomePage(), DEMO_MERCHANT, hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess() (+3 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.08
Nodes (25): CarteIdentitePage(), EmployeeScanPage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, CustomerLoyaltyOverview, DEMO_LOYALTY_OVERVIEW, DEMO_EMAIL (+17 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (38): CardTemplateBackground(), LoyaltyWidgetProgressInput, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer() (+30 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 75 - "ref_node_fs"
Cohesion: 0.09
Nodes (11): ref_node_fs, outDir, outDir, outDir, generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser (+3 more)

### Community 76 - "lib/campaign-worker.ts"
Cohesion: 0.06
Nodes (45): jose, log(), loop(), requestShutdown(), sleep(), bodySchema, POST(), runAdLifecycleTick() (+37 more)

### Community 77 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.13
Nodes (37): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+29 more)

### Community 79 - "stripe.ts"
Cohesion: 0.10
Nodes (33): stripe, POST(), GET(), BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode() (+25 more)

### Community 80 - "getSuperAdminSessionUser"
Cohesion: 0.15
Nodes (12): DiagnosticPage(), SuperAdminDiagnosticPage(), SuperAdminCardsPage(), MerchantCardsPage(), SuperAdminMerchantDetail(), SuperAdminMerchantsPage(), ContractsPage(), SuperAdminContractsPage() (+4 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.13
Nodes (16): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile(), h (+8 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "jsonError"
Cohesion: 0.06
Nodes (47): GET(), PATCH(), GET(), POST(), GET(), GET(), DELETE(), POST() (+39 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (21): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+13 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.16
Nodes (17): activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress, formatActivityDate() (+9 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "profile-shared.tsx"
Cohesion: 0.25
Nodes (12): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+4 more)

### Community 104 - "loyalty-service.ts"
Cohesion: 0.15
Nodes (19): GET(), GET(), sortOrder(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit(), incrementBalanceData() (+11 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.15
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "prisma.ts"
Cohesion: 0.11
Nodes (16): POST(), schema, POST(), GET(), GET(), POST(), GET(), GET() (+8 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "signInWithGoogleProfile"
Cohesion: 0.24
Nodes (10): GET(), createGoogleAuthUrl(), isUniqueConstraintError(), signInWithGoogleProfile(), ALLOWED_RETURN_PREFIXES, appendQuery(), sanitizeInternalReturnTo(), baseIntent (+2 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "card-deck.tsx"
Cohesion: 0.08
Nodes (37): activeCardFromDeck(), CardDeck(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex(), readDeckMetrics() (+29 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.15
Nodes (18): POST(), schema, GET(), previewResponse(), staffContext(), loadAdPreviewCard(), parsePlacement(), recordImpression() (+10 more)

### Community 125 - "cards-index.tsx"
Cohesion: 0.16
Nodes (14): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+6 more)

### Community 126 - "sponsored-hours-pricing.ts"
Cohesion: 0.18
Nodes (11): slotAmountCents(), parisHourInstant(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), rateForParisHour(), SPONSORED_HOUR_RATE_CENTS (+3 more)

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.19
Nodes (15): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+7 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 130 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.30
Nodes (12): GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST(), canExposeInvitationLinkInAdmin() (+4 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "super-admin-session.ts"
Cohesion: 0.38
Nodes (8): cookieOptions(), createSuperAdminSession(), destroySuperAdminSession(), getRequestSuperAdminUser(), getSuperAdminUserFromToken(), hashSuperAdminToken(), isSuperAdminEmailAllowed(), superAdminTokenFromRequest()

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "super-admin/campagnes/page.tsx"
Cohesion: 0.33
Nodes (3): CampaignModerationHome(), formatCents(), SuperAdminCampagnesPage()

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.20
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.21
Nodes (9): adminStage(), createAd(), ctx(), fake, h, jsonReq(), merchantStage(), moderate() (+1 more)

### Community 143 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (6): ref_os, GET(), notFound(), config(), loadRoute(), PNG_BYTES

### Community 144 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 145 - "events/route.ts"
Cohesion: 0.19
Nodes (12): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+4 more)

### Community 146 - "CampagnesPanel"
Cohesion: 0.22
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 147 - "employee-create.ts"
Cohesion: 0.39
Nodes (5): createDirectEmployee(), CreateEmployeeInput, EmployeeCreateError, presetPermissions(), createEmployeeSchema

### Community 148 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.16
Nodes (20): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+12 more)

### Community 151 - "customer-history.ts"
Cohesion: 0.38
Nodes (5): BenefitEntry, formatLoyaltyEntry(), HistoryEntry, mapLoyaltyCategory(), mapLoyaltyTone()

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.23
Nodes (11): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, resetSponsoredSessionState() (+3 more)

### Community 155 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 156 - "solde/ui.tsx"
Cohesion: 0.16
Nodes (15): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+7 more)

### Community 157 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 158 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 159 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 160 - "ad-detail.tsx"
Cohesion: 0.12
Nodes (16): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+8 more)

### Community 161 - "ref_next_server"
Cohesion: 0.08
Nodes (20): ref_next_server, isProduction(), assertSuperAdminProductionConfig(), isSuperAdminAllowedEmailsConfigured(), setSuperAdminEntryCookie(), SUPER_ADMIN_ENTRY_COOKIE, superAdminEntryCookieOptions(), inAppNotificationCount (+12 more)

### Community 162 - "fiche/[id]/page.tsx"
Cohesion: 0.29
Nodes (5): SuperAdminAdDetailPage(), adRequestFindUnique, getSuperAdminSessionUser, notFound, redirect

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.33
Nodes (4): CreateMerchantPage(), CreateMerchantWizard(), goNext(), stepError()

### Community 165 - "card-deck-interaction.test.ts"
Cohesion: 0.43
Nodes (4): handleCardExpand(), CARD_NO_EXPAND_SELECTOR, shouldIgnoreCardExpand(), shouldProceedWithCardExpand()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.14
Nodes (24): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+16 more)

### Community 167 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 170 - "arret/route.ts"
Cohesion: 0.47
Nodes (4): GET(), schema, BillingError, previewCancellation()

### Community 171 - "app/statistiques/page.tsx"
Cohesion: 0.40
Nodes (3): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage()

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (26): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CardDecorativeStyle, cardElementSchema (+18 more)

### Community 174 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 175 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 176 - "abonnements/page.tsx"
Cohesion: 0.50
Nodes (4): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight()

### Community 177 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

### Community 179 - "isGoogleSignInEnabled"
Cohesion: 0.67
Nodes (3): CustomerLoginPage(), isGoogleAuthConfigured(), isGoogleSignInEnabled()

## Knowledge Gaps
- **984 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+979 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1316 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-labels.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `react`, `getSessionUser`, `loyalty-widget.ts`, `validation.ts`, `card-editor-properties.tsx`, `merchant-billing.ts`, `insight-period.ts`, `src/app/layout.tsx`, `statistics/route.ts`, `google-wallet.ts`, `env.ts`, `customer-reward-progress.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `fake-ad-db.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-commit.ts`, `demo-session.ts`, `use-wallet-unlock-animation.ts`, `loyaltyBalanceForMode`, `super-admin.test.ts`, `qa-login.ts`, `tarifs/page.tsx`, `email.ts`, `sponsored-slot.test.tsx`, `wallet-home.tsx`, `@prisma/client`, `platform-stats.ts`, `fife-life/merchant-detail.tsx`, `ref_path`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `merchant-card-renderer.tsx`, `caisse-client-number.test.ts`, `ref_node_fs`, `lib/campaign-worker.ts`, `ads/[id]/confirm/route.ts`, `stripe.ts`, `qr.ts`, `ad-visual-journeys.test.ts`, `customer-loyalty-overview.ts`, `loyalty-service.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `signInWithGoogleProfile`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `super-admin-campaign-moderation.test.ts`, `merchant-ad-edit.test.ts`, `landing-page.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `[kind]/route.ts`, `api-merchant-statistics-route.test.ts`, `employee-create.ts`, `marketing-balance.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `marketing-topup-route.test.ts`, `super-admin-ad-moderation.test.ts`, `campaign-lifecycle.ts`, `caisse-scan-route.test.ts`, `ref_next_server`, `fiche/[id]/page.tsx`, `card-deck-interaction.test.ts`, `campaign-audience.test.ts`, `card-template-schema.ts`, `campaign-quota.test.ts`, `insight-permissions.test.ts`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `loyalty-labels.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `vitest`, `getSessionUser`, `super-admin-session.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `jsonOk`, `requireMerchantAdmin`, `merchant-billing.ts`, `events/route.ts`, `ad-visual-workflow.ts`, `employee-create.ts`, `employee-invitation-service.ts`, `customer-history.ts`, `google-auth.ts`, `google-wallet.ts`, `customer-profile.ts`, `api-guard.ts`, `campaign-lifecycle.ts`, `env.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `advantages-ui.tsx`, `card-editor.tsx`, `package.json`, `sponsored-selection.ts`, `loyalty-commit.ts`, `use-wallet-unlock-animation.ts`, `loyaltyBalanceForMode`, `super-admin.test.ts`, `qa-login.ts`, `insight-stats.ts`, `wallet-home.tsx`, `platform-stats.ts`, `merchant-app-access.ts`, `demo-visual.ts`, `merchant-card-renderer.tsx`, `lib/campaign-worker.ts`, `ads/[id]/confirm/route.ts`, `qr.ts`, `customer-loyalty-overview.ts`, `loyalty-service.ts`, `programme/ui.tsx`, `prisma.ts`, `cards-index.tsx`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `merchants-list.tsx`, `app/ui.tsx`, `merchant-card-template-service.ts`, `vitest`, `ref_next_navigation`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `cn`, `clients/ui.tsx`, `src/app/layout.tsx`, `sponsored-slot.tsx`, `fiche.tsx`, `solde/ui.tsx`, `advantages-ui.tsx`, `ad-detail.tsx`, `package.json`, `card-editor.tsx`, `statistiques-panel.tsx`, `google-wallet-media-crop.tsx`, `use-media-query.ts`, `scan/ui.tsx`, `profile-page.tsx`, `loyalty-commit.ts`, `src/app/page.tsx`, `use-wallet-unlock-animation.ts`, `qa-login.ts`, `tarifs/page.tsx`, `sponsored-slot.test.tsx`, `wallet-home.tsx`, `facturation/ui.tsx`, `fife-life/merchant-detail.tsx`, `merchant-card-renderer.tsx`, `campagnes/ui.tsx`, `profile-shared.tsx`, `programme/ui.tsx`, `notifications-center.tsx`, `card-deck.tsx`, `cards-index.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _984 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.059298245614035086 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.03884297520661157 - nodes in this community are weakly interconnected._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.06961770623742455 - nodes in this community are weakly interconnected._